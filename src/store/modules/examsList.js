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
            state.exams.unshift(value)
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
        deleteFromExamList(state, value){
            const target = state.exams.find(exam => exam.id == value)
            const index = state.exams.indexOf(target)
            state.exams.splice(index, 1)
        },
        excludeExaminee(state, value){
            const examTarget = state.exams.find(exam => exam.id == value.examID)

            if(examTarget) {
                const examIndex = state.exams.indexOf(examTarget)
                const userTarget = state.exams[examIndex].users.find(user => user.id == value.userID)

                if(userTarget){
                    const userIndex = state.exams[examIndex].users.indexOf(userTarget)
                    state.exams[examIndex].users.splice(userIndex, 1)
                }
            }
        },
        updateExamineeStatus(state, value) {
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
                    }  else if(value.type == 'pause') {
                        // Подумать над остановкой времени (+БД)
                        state.exams[examIndex].users[userIndex].status = 'paused'
                        state.exams[examIndex].users[userIndex].time = value.time
                    }  else if(value.type == 'resume') {
                        // Подумать над остановкой времени (+БД)
                        state.exams[examIndex].users[userIndex].status = 'working'
                        state.exams[examIndex].users[userIndex].time = value.time
                    }  else if(value.type == 'stop') {
                        state.exams[examIndex].users[userIndex].subject = null
                        state.exams[examIndex].users[userIndex].time.start = null
                        state.exams[examIndex].users[userIndex].time.value = null
                        state.exams[examIndex].users[userIndex].status = 'blocked'
                    }  else if(value.type == 'reset') {
                        state.exams[examIndex].users[userIndex].subject = null
                        state.exams[examIndex].users[userIndex].time.start = null
                        state.exams[examIndex].users[userIndex].time.value = null
                        state.exams[examIndex].users[userIndex].status = 'waiting'
                    }
                }
            }
        }
    },
    actions: {
    }
}