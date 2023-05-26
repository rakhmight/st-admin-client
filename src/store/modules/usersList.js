export default {
    state: {
        usersList: [],
        membersList: [],
    },
    getters: {
        getMembersList(state){
          return state.membersList
        },
        getUsersList(state){
          return state.usersList
        },
    },
    mutations: {
        setUsersList(state, value){
          state.usersList = value
        },
        setMembersList(state, value){
          state.membersList = value
        },
        updateMembersList(state, value){
          state.membersList.push(value)
        },
    },
    actions: {
    }
}