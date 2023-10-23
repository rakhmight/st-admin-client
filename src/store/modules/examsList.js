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
        },

        updateExamineeStatus(state, value) {
        // userID
        // type
        // examID
            const examTarget = state.exams.find(exam => exam.id == value.examID)

            if(examTarget) {
                const examIndex = state.exams.indexOf(examTarget)
                const userTarget = state.exams[examIndex].users.find(user => user.id == value.userID)

                if(userTarget){
                    const userIndex = state.exams[examIndex].users.indexOf(userTarget)

                    if(value.type == 'start') {
                        state.exams[examIndex].users[userIndex].status = 'working'
                    } else if(value.type == 'additional') {
                        state.exams[examIndex].users[userIndex].status = 'working'
                        state.exams[examIndex].users[userIndex].subject = value.subject
                        state.exams[examIndex].users[userIndex].time = value.time
                    } else if(value.type == 'saving') {
                        state.exams[examIndex].users[userIndex].status = 'waiting'
                        state.exams[examIndex].users[userIndex].subject = value.subject
                        state.exams[examIndex].users[userIndex].time = value.time
                    }  else if(value.type == 'finished') {
                        state.exams[examIndex].users[userIndex].subject = value.subject
                        state.exams[examIndex].users[userIndex].time = value.time
                        state.exams[examIndex].users[userIndex].status = 'finished'
                    }  else if(value.type == 'failed') {
                        state.exams[examIndex].users[userIndex].subject = value.subject
                        state.exams[examIndex].users[userIndex].time = value.time
                        state.exams[examIndex].users[userIndex].status = 'failed'
                    }
                }
            }
        }
    },
    actions: {
    }
}