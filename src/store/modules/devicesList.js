export default {
    state: {
        devices: [],
    },
    getters: {
        getDevices(state){
          return state.devices
        },
    },
    mutations: {
        setDevices(state, value){
          state.devices = value
        },
        updateDevicesList(state, value){
            state.devices.push(value)
        },
        changeDeviceState(state, value){
            if(value.type=='status'){
                const target = state.devices.find(device=>device.id==value.id)
                if(target!=-1){
                    const index = state.devices.indexOf(target)
                    if(value.status=='online'){
                        state.devices[index].status='online'
                    } else if(value.status=='offline'){
                        state.devices[index].status='offline'
                    }
                }
            }
        }
    },
    actions: {
    }
}