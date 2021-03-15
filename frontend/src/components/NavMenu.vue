<template>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
    <el-menu-item index="1">SSA BANG(싸방)</el-menu-item>
    <el-menu-item>방 찾기</el-menu-item>
    <el-menu-item>방 팔기</el-menu-item>


    <el-submenu v-if="user.id" index="2">
        <template slot="title">{{user.name}}님 환영합니다.</template>
        <el-menu-item>내 프로필</el-menu-item>
        <el-menu-item>내가 올린 방</el-menu-item>
        <el-menu-item @click="SET_LOGOUT()">로그아웃</el-menu-item>
    </el-submenu>
    <el-submenu v-else index="2" >
        <template slot="title">회원가입 / 로그인</template>
        <el-menu-item index="2-1" @click="SET_REGISTER_MODAL(true)">회원가입</el-menu-item>
        <el-menu-item index="2-2" @click="SET_LOGIN_MODAL(true)">로그인</el-menu-item>
    </el-submenu>


    <Register></Register>
    <Login></Login>
    <!-- <el-menu-item index="3" disabled>Info</el-menu-item> -->
    <!-- <el-menu-item index="4"><a href="https://www.ele.me" target="_blank">Orders</a></el-menu-item> -->
    </el-menu>
</template>

<script>
import Register from './Register.vue'
import Login from './Login.vue'
import { mapState, mapMutations } from 'vuex';
export default {
    components: {
        Register,
        Login
    },
    data() {
        return {
        activeIndex: "1",
        activeIndex2: "1",
        };
    },
    computed: {
        ...mapState(["user"]),
    },
    methods: {
        handleSelect(key, keyPath) {
        console.log(key, keyPath);
        },
        ...mapMutations([ 'SET_LOGIN_MODAL', 'SET_REGISTER_MODAL', 'SET_LOGOUT' ]),
    },
};
</script>