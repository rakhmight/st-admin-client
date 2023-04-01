import { createStore } from 'vuex'

export default createStore({
  state: {
    isAuth: false,
    role: null
  },
  getters: {
    getAuthState(state){
      return state.isAuth
    },
    getRole(state){
      return state.role
    }
  },
  mutations: {
    changeAuthState(state, value){
      state.isAuth = value
    },
    setRole(state, value){
      state.role = value
    }
  },
  actions: {
  },
  modules: {
  }
})
