import { createStore } from 'vuex'

export default createStore({
  state: {
    isAuth: false,
    role: null,
    userData: {},
    usersList: [],
    departments: [],
    authParams:{id: null, token:null},
    membersList: [],
    subjects: [],
    themes: [],
    currentSubject: undefined
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
    },

    getSubjects(state){
      return state.subjects
    },
    getThemes(state){
      return state.themes
    },
    getCurrentSubject(state){
      return state.currentSubject
    },
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
    },

    setSubjects(state, value){
      state.subjects = value
    },
    updateSubjects(state, value){
      state.subjects.push(value)
    },
    updateSubjectThemes(state, obj){
      state.subjects[obj.index].themes = obj.themes
    },
    setThemes(state, value){
      state.themes = value
    },
    setCurrentSubject(state, value){
      state.currentSubject = value
    },
    setCurrentSubjectThemes(state, value){
      state.currentSubject.themes = value
    }
  },
  actions: {
  },
  modules: {
  }
})
