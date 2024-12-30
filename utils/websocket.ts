import { io } from 'socket.io-client'
import { reactive } from 'vue'

export const wsState = reactive({
  connected: false,
  transport: 'N/A',
  error: null
})

export const socket = io({
  auth: {
    token: localStorage.getItem('auth:token')
  },
  autoConnect: false
})

socket.on('connect', () => {
  wsState.connected = true
})

socket.on('disconnect', () => {
  wsState.connected = false
  wsState.transport = 'N/A'
})

export async function wsConnect() {
  try {
    await getME()

    socket.connect()

    socket.io.engine.on('upgrade', (rawTransport) => {
      wsState.transport = rawTransport.name
    })
    console.log('Connected to WS')
  } catch (e) {
    console.error(e)
  }
}

export function wsSendMessage(message: any) {
  socket.emit('message', message)
}
