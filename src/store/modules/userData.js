export default {
    state: {
        role: null,
        userData: {},
    },
    getters: {
        getRole(state){
          return state.role
        },
        getUserData(state){
          return state.userData
        },
    },
    mutations: {
        setRole(state, value){
          state.role = value
        },
        setUserData(state, value){
          state.userData = value
        },
    },
    actions: {
    }
}