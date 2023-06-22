export default {
    state: {
        adminServerIP: 'http://172.16.12.126:4500',
        authServerIP: 'http://172.16.12.126:4600'
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