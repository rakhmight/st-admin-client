export default {
    state: {
        subjects: [],
        themes: [],
        currentSubject: undefined,
    },
    getters: {
        getSubjects(state){
          return state.subjects
        },
        getThemes(state){
          return state.themes
        },
        getCurrentSubject(state){
          return state.currentSubject
        },
    },
    mutations: {
        setSubjects(state, value){
          state.subjects = value
        },
        updateSubjects(state, value){
          state.subjects.unshift(value)
        },
        updateSubjectThemes(state, obj){
          state.subjects[obj.index].themes = obj.themes
        },
        setThemes(state, value){
          state.themes = value
        },
        setCurrentSubject(state, value){
          state.currentSubject = value
        },
        setCurrentSubjectThemes(state, value){
          state.currentSubject.themes = value
        },
    },
    actions: {
    }
}