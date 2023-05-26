export default {
    state: {
        departments: [],
    },
    getters: {
        getDepartments(state){
          return state.departments
        },
    },
    mutations: {
        setDepartments(state, value){
          state.departments = value
        },
    },
    actions: {
    }
}