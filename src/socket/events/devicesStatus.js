import store from '@/store'

export function devicesStatusEvent(socket) {
    socket.on("admin-onlineDevices", (devices) => {
        devices.forEach(device => {
            store._mutations.changeDeviceState[0]({ type: 'status', id: device.deviceID, status: 'online' })
        });
    });
      
    socket.on("admin-connectDevice", (deviceID) => {
        store._mutations.changeDeviceState[0]({ type: 'status', id: deviceID, status: 'online' })
    });
    
    socket.on('admin-disconnectDevice', (deviceID) => {
        store._mutations.changeDeviceState[0]({ type: 'status', id: deviceID, status: 'offline' })
    })
}