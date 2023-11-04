import store from '@/store'

export function examineeStatusEvent(socket) {
    socket.on("admin-startExam", (examineeData) => {
        // console.log(examineeData);
        store._mutations.updateCurrentExamineeStatus[0](examineeData)
        store._mutations.updateExamineeStatus[0](examineeData)
    });

    socket.on('admin-exam-additional', (additionalData) => {
        // console.log(additionalData);
        store._mutations.updateCurrentExamineeStatus[0](additionalData)
        store._mutations.updateExamineeStatus[0](additionalData)
    })

    socket.on("admin-pauseExam", (examineeData) => {
    });

    socket.on("admin-resumeExam", (examineeData) => {
    });

    socket.on("admin-finishExam", (examineeData) => {
        store._mutations.updateCurrentExamineeStatus[0](examineeData)
        store._mutations.updateExamineeStatus[0](examineeData)
    });
      
    // socket.on("admin-connectDevice", (deviceID) => {
    //     store._mutations.changeDeviceState[0]({ type: 'status', id: deviceID, status: 'online' })
    // });
    
    // socket.on('admin-disconnectDevice', (deviceID) => {
    //     store._mutations.changeDeviceState[0]({ type: 'status', id: deviceID, status: 'offline' })
    // })
}