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
        },
        updateExamState(state, value){
            const target = state.exams.find(ex=> ex.id==value.examID)
            const index = state.exams.indexOf(target)
            if(value.type=='begun'){
                state.exams[index].hasBegun = true
                state.exams[index].stopped = false
            } else if(value.type=='stopped'){
                state.exams[index].hasBegun = false
                state.exams[index].stopped = true
            }
        }
    },
    actions: {
    }
}