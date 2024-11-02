import { Peer, Message } from 'crossws'
import { Room } from '@/server/db'
import { Schema, Types } from 'mongoose'

export default defineWebSocketHandler({
  open: async (peer: Peer) => {
    try {
      peer.send(
        JSON.stringify({
          type: 'welcome',
          message: 'Welcome to the ws'
        })
      )

      const index = (peer.headers as any).cookie.indexOf('auth:token')
      if (index == -1) {
        console.error('Invalid auth')
        return
      }

      const token = (peer.headers as any).cookie.substring(index + 11)
      const s = await getAuthSession(token)
      if (!s) {
        console.error('Invalid auth for ws')
        return
      }

      const ptoken = new Types.ObjectId(s.user_id)
      console.log('Auth:', token)

      const rooms = await Room.find()
        .where('users')
        .equals(ptoken)
        .where('typingUsers')
        .equals(ptoken)
        .exec()

      console.log('Rooms:', rooms)

      rooms.forEach((room) => {
        console.log(`Subscribing ${s.user_id} to room ${room.conversationId}`)
        peer.subscribe(room.conversationId.toString())
      })
    } catch (e) {
      console.error(e)
    }
  },

  message: async (peer: Peer, message: Message) => {
    const data = JSON.parse(message.toString())
    console.log('WS MESSAGE: ', data)

    if (data.type == 'chat_message') {
      try {
        const room = await Room.findOne({ roomId: data.roomId })
        if (!room) {
          throw new Error('Room not found')
        }

        peer.publish(room.conversationId.toString(), {
          content: data.content,
          senderId: data.senderId
        })
      } catch (e) {
        console.error(e)
        return
      }
    }
  },

  close: (peer: Peer) => {},

  error: (peer: Peer, error: Error) => {
    console.error('WS ERROR: ', error)
  }
})
