export default {
    state: {
        adminServerIP: 'http://localhost:4500',
        authServerIP: 'http://localhost:3600'
    },
    getters: {
        getAdminServerIP(state){
            return state.adminServerIP
        },
        getExamServerIP(state){
            return state.examServerIP
        },
        getAuthServerIP(state){
            return state.authServerIP
        }
    },
    mutations: {
    },
    actions: {
    }
}