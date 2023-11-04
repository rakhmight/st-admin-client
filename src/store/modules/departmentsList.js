export default {
    state: {
        departments: [],
        positions: [],
        currentDepartment: undefined
    },
    getters: {
        getDepartments(state){
          return state.departments
        },
        getPositions(state){
          return state.positions
        },
        getCurrentDepartment(state){
          return state.currentDepartment
        }
    },
    mutations: {
        setDepartments(state, value){
          state.departments = value
        },

        updateDepartments(state, value){
          state.departments.unshift(value)
        },
        updatePositions(state, obj){
          state.departments[obj.index].positions = obj.positions
        },
        setPositions(state, value){
          state.positions = value
        },
        setCurrentDepartment(state, value){
          state.currentDepartment = value
        },
        setCurrentPositions(state, value){
          state.currentDepartment.positions = value
        }
    },
    actions: {
    }
}