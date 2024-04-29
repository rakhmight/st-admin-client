export default {
    state: {
        adminServerIP: 'http://192.168.24.120:4500',
        authServerIP: 'http://192.168.24.120:4600'
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