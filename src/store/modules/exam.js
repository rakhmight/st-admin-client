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
        updateCurrentExamineeStatus(state, value) {
          if(state && state.id) {
            if(state.id == value.examID){
              const userTarget = state.users.find(user => user.id == value.userID)

              if(userTarget){
                  const userIndex = state.users.indexOf(userTarget)

                  if(value.type == 'start') {
                      state.users[userIndex].status = 'working'
                  } else if(value.type == 'additional') {
                    state.users[userIndex].status = 'working'
                    state.users[userIndex].subject = value.subject
                    state.users[userIndex].time = value.time
                  } else if(value.type == 'saving') {
                    state.users[userIndex].status = 'waiting'
                    state.users[userIndex].subject = value.subject
                    state.users[userIndex].time = value.time
                  } else if(value.type == 'finished') {
                    state.users[userIndex].status = 'finished'
                    state.users[userIndex].subject = value.subject
                    state.users[userIndex].time = value.time
                  }  else if(value.type == 'failed') {
                    state.users[userIndex].subject = value.subject
                    state.users[userIndex].time = value.time
                    state.users[userIndex].status = 'failed'
                }
              }
            }
          }
        }
    },
    actions: {
    }
}