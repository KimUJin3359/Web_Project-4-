<template>
<el-dialog title="SSA BANG(싸방 회원가입)" :visible.sync="modal.register">
<el-form :model="form" @submit.prevent="">
    <el-form-item label="이름" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="이메일" :label-width="formLabelWidth">
        <el-input v-model="form.email" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="비밀번호" :label-width="formLabelWidth">
        <el-input v-model="form.password" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="비밀번호 확인" :label-width="formLabelWidth">
        <el-input v-model="form.passwordCheck" autocomplete="off"></el-input>
    </el-form-item>
</el-form>
<span slot="footer" class="dialog-footer">
    <el-button @click="SET_REGISTER_MODAL(false)">취소</el-button>
    <el-button type="primary" @click="register">회원가입</el-button>
</span>
</el-dialog>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { userAPI } from '../utils/axios';

export default {
    data() {
        return {
            dialogTableVisible: false,
            dialogFormVisible: false,
            form: {
                name: '',
                email: '',
                password: '',
                passwordCheck: '',
            },
            formLabelWidth: '120px'
        };
    },
    computed: {
        ...mapState(["modal"]),
    },
    methods: {
        ...mapMutations(["SET_REGISTER_MODAL", "SET_LOGIN_MODAL"]),
        async register() {
            const { name, email, password, passwordCheck } = this.form;
            if (!name || !email || !password || !passwordCheck){
                alert("이름, 이메일, 비밀번호를 모두 입력해주세요");
                return;
            }
            if (password !== passwordCheck) {
                alert("비밀번호와 비밀번호 확인을 같게 입력해주세요");
                return;
            }
            const result = await userAPI.register(name, email, password);
            if (result.data.status === "OK") {
                alert("회원가입이 완료되었습니다");
                this.SET_LOGIN_MODAL(true);
            }
            else {
                alert("회원가입이 실패하였습니다");
            }
        }
    }
};
</script>