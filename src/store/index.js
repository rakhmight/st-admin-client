import { createStore } from 'vuex'

export default createStore({
  state: {
    isAuth: false
  },
  getters: {
    getAuthState(state){
      return state.isAuth
    }
  },
  mutations: {
    changeAuthState(state, value){
      state.isAuth = value
    }
  },
  actions: {
  },
  modules: {
  }
})
