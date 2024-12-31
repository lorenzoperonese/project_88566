import { io } from 'socket.io-client'
import { reactive } from 'vue'

const { token } = useAuth()

export const wsState = reactive({
  connected: false,
  transport: 'N/A',
  error: null,
  notifications: [] as any[]
})

export const socket = io({
  auth: {
    token: token.value
  }
})

socket.on('connect', () => {
  wsState.connected = true
})

socket.on('disconnect', () => {
  wsState.connected = false
  wsState.transport = 'N/A'
})

socket.on('notification', (notification) => {
  console.log('Notification:', notification)
  wsState.notifications.push(notification)
})

socket.io.engine.on('upgrade', (rawTransport) => {
  wsState.transport = rawTransport.name
})

export function wsSendMessage(message: any) {
  socket.emit('message', message)
}

export function wsSendAuth() {
  socket.emit('auth', token.value)
}
