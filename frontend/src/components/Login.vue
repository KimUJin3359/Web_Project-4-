<template>
  <el-dialog title="로그인" :visible.sync="modal.login">
    <el-form :model="form">
      <el-form-item label="이메일" :label-width="formLabelWidth">
        <el-input v-model="form.email" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="비밀번호" :label-width="formLabelWidth">
        <el-input v-model="form.password" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="SET_LOGIN_MODAL(false)">취소</el-button>
      <el-button type="primary" @click="login">로그인</el-button>
    </span>
    <span> {{ status }}</span>
  </el-dialog>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { userAPI } from "../utils/axios";

export default {
  data() {
    return {
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        email: "",
        password: "",
      },
      formLabelWidth: "120px",
      status: "",
    };
  },
  computed: {
    ...mapState(["modal"]),
  },
  methods: {
    ...mapMutations(["SET_LOGIN_MODAL", "SET_USER"]),
    async login() {
      const { email, password } = this.form;
      if (!email || !password) {
        this.status = "이메일과 비밀번호를 입력해주세요";
        return;
      }
      const result = await userAPI.login(email, password);
      if (result.data.token) {
        localStorage.setItem("token", result.data.token);
        this.SET_USER({ id: result.data.id, name: result.data.name });
        this.SET_LOGIN_MODAL(false);
      } else if (result.data.status === "PASSWORD ERROR") {
        alert("이메일과 비밀번호를 다시 입력해주세요");
        this.form.email = "";
        this.form.password = "";
      }
    },
  },
};
</script>