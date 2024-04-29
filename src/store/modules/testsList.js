export default {
    state: {
        testImages: [],
        testsDataSwitcher: false,
        testsGetting: true
    },
    getters: {
        getTestImages(state){
          return state.testImages
        },

        getTestsDataSwitcher(state){
          return state.testsDataSwitcher
        },

        getTestsGetting(state){
          return state.testsGetting
        }
    },
    mutations: {
        updateTestImages(state, value){
          state.testImages.unshift(value)
        },
        setTestImages(state, value){
          state.testImages = value
          state.testsGetting = false
        },
        replaceTestImages(state, value){
          console.log(value);
          const target = state.testImages.find(testImage=>testImage.id==value.id)
          if(target){
            const index = state.testImages.indexOf(target)
            state.testImages.splice(index, 1)
    
            state.testImages.unshift(value)
          }
        },

        switchTestsDataSwitcher(state){
          state.testsDataSwitcher = !state.testsDataSwitcher
        },

        changeTestImage(state, params){
          if(params.operation=='type'){
            const target = state.testImages.find(image => image.id==params.id)
            const index = state.testImages.indexOf(target)

            state.testImages[index].type = params.type
          } else if(params.operation == 'return'){
            const target = state.testImages.find(image => image.id==params.id)
            const index = state.testImages.indexOf(target)

            state.testImages[index].status.value = params.status
            state.testImages[index].status.rejected = 'admin'
            state.testImages[index].remarks = [{
              msg: 'Test returned for review',
              type: 'general'
            }]
          }
        }
    },
    actions: {
    }
}