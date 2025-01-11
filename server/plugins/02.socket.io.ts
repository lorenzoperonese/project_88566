import type { NitroApp } from 'nitropack/types'
import { Server as Engine } from 'engine.io'
import { Server } from 'socket.io'
import { defineEventHandler } from 'h3'
import {
  createChatRooms,
  getReceiverFromRoom,
  sendChatMessage
} from '@/server/utils/chat'
import { User } from '@/server/db'

// Create a global io instance
let globalIo: Server

export function getIo(): Server {
  return globalIo
}

let authSockets = new Set<string>()

export default defineNitroPlugin((nitroApp: NitroApp) => {
  const engine = new Engine()
  const io = new Server()
  globalIo = io

  io.bind(engine)

  io.on('connection', async (socket) => {
    let [isAuth, user_id] = await isAuthenticated(socket.handshake.auth.token)
    if (isAuth) {
      socket.join(user_id)
      authSockets.add(user_id)
    }

    socket.on('error', (err) => {
      if (err && err.message === 'unauthorized event') {
        socket.disconnect()
        authSockets.delete(user_id)
      }
    })

    socket.on('chat_message', async (message, callback) => {
      if (!authSockets.has(socket.id)) throw new Error('Not authorized')

      console.log('Chat Message:', message)

      try {
        await sendChatMessage(message.roomId, message.content, message.senderId)
        callback({ type: 'success', message: 'Message sent' })

        let receiver_id = await getReceiverFromRoom(message.roomId)

        if (authSockets.has(receiver_id)) {
          io.to(receiver_id).emit('chat_message', message)
        } else {
          let u = await User.findOne({ _id: receiver_id })
          if (!u) throw new Error('User not found')

          const p = {
            id: '0',
            title: `Chat ${u.username}`,
            body: message.content,
            users: [receiver_id],
            event_id: ''
          } as PushNotification

          sendPushNotification(p)
        }
      } catch (e) {
        console.error('Sending chat message:', e)
        callback({ type: 'error', message: 'Cannot send message' })
      }
    })

    socket.on('room_add', async (message, callback) => {
      if (!authSockets.has(socket.id)) throw new Error('Not authorized')

      console.log('Room add:', message)

      try {
        await createChatRooms(message.senderId, message.receiverId)
        callback({ type: 'success', message: 'Room added' })

        io.to(message.receiverId).emit('room_add', message)
      } catch (e) {
        console.error('Creating room:', e)
        callback({ type: 'error', message: 'Cannot create room' })
      }
    })

    socket.on('auth', async (token) => {
      let [isAuth, user_id] = await isAuthenticated(token)
      if (isAuth) {
        socket.join(user_id)
        authSockets.add(socket.id)
      }
    })
  })

  nitroApp.router.use(
    '/socket.io/',
    defineEventHandler({
      handler(event) {
        // @ts-expect-error private method and property
        engine.handleRequest(event.node.req, event.node.res)
        event._handled = true
      },
      websocket: {
        open(peer) {
          // @ts-expect-error private method and property
          engine.prepare(peer._internal.nodeReq)
          // @ts-expect-error private method and property
          engine.onWebSocket(
            // @ts-expect-error private method and property
            peer._internal.nodeReq,
            // @ts-expect-error private method and property
            peer._internal.nodeReq.socket,
            peer.websocket
          )
        }
      }
    })
  )
})

// Return if the user is authenticated or not. Also return the user_id.
async function isAuthenticated(s: string): Promise<[boolean, string]> {
  if (!s) {
    return [false, '']
  }

  let token = s.split(' ')[1]
  console.log('Token:', token)

  const session = await getAuthSession(token)
  if (!session || isAuthSessionExpired(session)) {
    return [false, '']
  }

  return [true, session.user_id]
}
