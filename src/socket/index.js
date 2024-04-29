import { io } from "socket.io-client"
// Events
import { connectEvent } from "./events/connect"
import { disconnectEvent } from "./events/disconnect"
import { devicesStatusEvent } from "./events/devicesStatus"
import { examineeStatusEvent } from "./events/examineeStatus"

const URL = "http://192.168.24.120:4500"

const authParams = JSON.parse(localStorage.getItem('auth'))

export const socket = io(URL, {
  autoConnect: false,
  query: {
    ...authParams
  }
})

// Events
connectEvent(socket)
disconnectEvent(socket)
devicesStatusEvent(socket)
examineeStatusEvent(socket)