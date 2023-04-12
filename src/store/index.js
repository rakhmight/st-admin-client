import { createStore } from 'vuex'

export default createStore({
  state: {
    isAuth: false,
    role: null,
    userData: {},
    usersList: [],
    departments: [],
    authParams:{id: null, token:null},
    membersList: []
  },
  getters: {
    getAuthState(state){
      return state.isAuth
    },
    getRole(state){
      return state.role
    },
    getUserData(state){
      return state.userData
    },
    getUsersList(state){
      return state.usersList
    },
    getDepartments(state){
      return state.departments
    },
    getAuthParams(state){
      return state.authParams
    },
    getMembersList(state){
      return state.membersList
    }
  },
  mutations: {
    changeAuthState(state, value){
      state.isAuth = value
    },
    setRole(state, value){
      state.role = value
    },
    setUserData(state, value){
      state.userData = value
    },
    setUsersList(state, value){
      state.usersList = value
    },
    setDepartments(state, value){
      state.departments = value
    },
    setAuthParams(state, value){
      state.authParams.id = value.id
      state.authParams.token = value.token
    },
    setMembersList(state, value){
      state.membersList = value
    },
    updateMembersList(state, value){
      state.membersList.push(value)
    }
  },
  actions: {
  },
  modules: {
  }
})
