export default {
    state: {
        testImages: [],
    },
    getters: {
        getTestImages(state){
          return state.testImages
        },
    },
    mutations: {
        updateTestImages(state, value){
          state.testImages.unshift(value)
        },
        setTestImages(state, value){
          state.testImages = value
        },
        replaceTestImages(state, value){
          const target = state.testImages.find(testImage=>testImage.id==value.id)
          if(target){
            const index = state.testImages.indexOf(target)
            state.testImages.splice(index, 1)
    
            state.testImages.unshift(value)
          }
        },
        changeTestImage(state, params){
          if(params.operation=='type'){
            const target = state.testImages.find(image => image.id==params.id)
            const index = state.testImages.indexOf(target)
            state.testImages[index].type = params.type
          }
        }
    },
    actions: {
    }
}