import { io } from "socket.io-client"
// Events
import { connectEvent } from "./events/connect"
import { disconnectEvent } from "./events/disconnect"
import { devicesStatusEvent } from "./events/devicesStatus"

const URL = "http://172.16.12.126:4500"

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
