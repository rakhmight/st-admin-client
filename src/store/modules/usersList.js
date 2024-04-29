export default {
    state: {
        usersList: [],
        usersDataSwitcher: false
    },
    getters: {
        getUsersList(state){
          return state.usersList
        },

        getUsersDataSwitcher(state){
          return state.usersDataSwitcher
        }
    },
    mutations: {
      setUsersList(state, value){
        state.usersList = value
      },
      updateUsersList(state, value){
        state.usersList.unshift(value)
      },
      multipleUpdateUsersList(state, value){
        state.usersList.unshift(...value)
      },

      switchUsersDataSwitcher(state){
        state.usersDataSwitcher = !state.usersDataSwitcher
      },

      updateUserData(state, value){
        const targetUser = state.usersList.find(user => user.id === value.userID)

        if(targetUser){
          const indexUser = state.usersList.indexOf(targetUser)
          state.usersList[indexUser].bio.firstName = value.firstName
          state.usersList[indexUser].bio.lastName = value.lastName
          state.usersList[indexUser].bio.patronymic = value.patronymic
        }
      }
    },
    actions: {
    }
}