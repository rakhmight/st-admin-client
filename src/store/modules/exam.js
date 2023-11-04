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
        
        updateCurrentExamState(state, value){
          if(state.currentExam){
            if(value.type=='begun'){
                state.currentExam.hasBegun = true
                state.currentExam.stopped = false
            } else if(value.type=='stopped'){
                state.currentExam.hasBegun = false
                state.currentExam.stopped = true
            }
          }
        },
        updateCurrentExamineeStatus(state, value) {
          if(state.currentExam && state.currentExam.id) {
            if(state.currentExam.id == value.examID){
              const userTarget = state.currentExam.users.find(user => user.id == value.userID)

              if(userTarget){
                  const userIndex = state.currentExam.users.indexOf(userTarget)

                  if(value.type == 'start') {
                      state.currentExam.users[userIndex].status = 'working'
                  } else if(value.type == 'additional') {
                    state.currentExam.users[userIndex].status = 'working'
                    state.currentExam.users[userIndex].subject = value.subject
                    state.currentExam.users[userIndex].time = value.time
                  } else if(value.type == 'saving') {
                    state.currentExam.users[userIndex].status = 'waiting'
                    state.currentExam.users[userIndex].subject = value.subject
                    state.currentExam.users[userIndex].time = value.time
                  } else if(value.type == 'finished') {
                    state.currentExam.users[userIndex].status = 'finished'
                    state.currentExam.users[userIndex].subject = value.subject
                    state.currentExam.users[userIndex].time = value.time
                  }  else if(value.type == 'failed') {
                    state.currentExam.users[userIndex].subject = value.subject
                    state.currentExam.users[userIndex].time = value.time
                    state.currentExam.users[userIndex].status = 'failed'
                  }  else if(value.type == 'pause') {
                    // Подумать над остановкой времени (+БД)
                    state.currentExam.users[userIndex].status = 'paused'
                    state.currentExam.users[userIndex].time = value.time
                  }  else if(value.type == 'resume') {
                      // Подумать над остановкой времени (+БД)
                      state.currentExam.users[userIndex].status = 'working'
                      state.currentExam.users[userIndex].time = value.time
                  }  else if(value.type == 'stop') {
                    state.currentExam.users[userIndex].subject = null
                    state.currentExam.users[userIndex].time.start = null
                    state.currentExam.users[userIndex].time.value = null
                    state.currentExam.users[userIndex].status = 'blocked'
                  }  else if(value.type == 'reset') {
                    state.currentExam.users[userIndex].subject = null
                    state.currentExam.users[userIndex].time.start = null
                    state.currentExam.users[userIndex].time.value = null
                    state.currentExam.users[userIndex].status = 'waiting'
                  }
              }
            }
          }
        },
        excludeExamineeCurrentExam(state, value){
          const userTarget = state.currentExam.users.find(user => user.id == value.userID)

          if(userTarget){
              const userIndex = state.currentExam.users.indexOf(userTarget)
              state.currentExam.users.splice(userIndex, 1)
          }
        },
    },
    actions: {
    }
}