export default {
    state: {
        inspectTest: undefined
    },
    getters: {
        getInspectTest(state){
          return state.inspectTest
        }
    },
    mutations: {
        setInspectTest(state, value){
          state.inspectTest = value
        },
    },
    actions: {
    }
}