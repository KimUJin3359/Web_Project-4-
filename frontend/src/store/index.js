import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    modal: {
      login: false,
      register: false,
    },
    user: {

    }
  },
  mutations: {
    SET_REGISTER_MODAL(state, data) {
      state.modal.login = false;
      state.modal.register = data;
    },
    SET_LOGIN_MODAL(state, data) {
      state.modal.register = false;
      state.modal.login = data;
    },
    // 로그인 유지
    SET_USER(state, data) {
      state.user = data;
    },
    SET_LOGOUT(state) {
      state.user = {};
      localStorage.removeItem("token");
    }
  },
  actions: {
  },
  modules: {
  }
})
