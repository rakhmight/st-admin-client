export default {
    state: {
        currentExam: undefined,
    },
    getters: {
        getCurrentExam(state){
          return state.currentExam
        },
    },
    mutations: {
        setCurrentExam(state, value){
          state.currentExam = value
        },
    },
    actions: {
    }
}