export default {
    state: {
        isAuth: false,
        authParams:{id: null, token:null},
    },
    getters: {
        getAuthState(state){
          return state.isAuth
        },
        getAuthParams(state){
          return state.authParams
        },
    },
    mutations: {
        changeAuthState(state, value){
          state.isAuth = value
        },
        setAuthParams(state, value){
          state.authParams.id = value.id
          state.authParams.token = value.token
        },
    },
    actions: {
    }
}  