export default {
    state: {
        exams: []
    },
    getters: {
        getExams(state){
            return state.exams
        }
    },
    mutations: {
        setExams(state, value){
            state.exams = value
        },
        addExam(state, value){
            state.exams.push(value)
        }
    },
    actions: {
    }
}