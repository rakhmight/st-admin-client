export default {
    state: {
        usersList: [],
    },
    getters: {
        getUsersList(state){
          return state.usersList
        },
    },
    mutations: {
        setUsersList(state, value){
          state.usersList = value
        },
        updateUsersList(state, value){
          state.usersList.push(value)
        },
        multipleUpdateUsersList(state, value){
          state.usersList.push(...value)
        },
    },
    actions: {
    }
}