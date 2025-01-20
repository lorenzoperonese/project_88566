import { io } from 'socket.io-client'
import { reactive } from 'vue'

const { token: t } = useAuth()

let token = t.value as String

export const wsState = reactive({
  connected: false,
  transport: 'N/A',
  error: null,
  notifications: [] as any[],
  rooms: [] as any[],
  chatMessages: [] as any[]
})

export const socket = io({
  auth: (cb) => {
    cb({ token: token }) // Gets fresh token value each time
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

socket.on('chat_message', (message) => {
  console.log('Chat Message:', message)
  wsState.chatMessages.push(message)
})

socket.on('room_add', (room) => {
  console.log('Room:', room)
  wsState.rooms.push(room)
})

socket.io.engine.on('upgrade', (rawTransport) => {
  wsState.transport = rawTransport.name
})

export function wsSendMessage(message: any) {
  socket.emit('message', message)
}

export function wsSendAuth() {
  const { token: t } = useAuth()
  token = t.value as String
  socket.emit('auth', token)
}
