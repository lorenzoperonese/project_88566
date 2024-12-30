//import type { Peer, Message } from 'crossws'
//import { Room, User, Message as DBMessage } from '@/server/db'
//import { Schema, Types } from 'mongoose'
//import { createRooms } from '../utils/chat'
//
//export default defineWebSocketHandler({
//  open: async (peer: Peer) => {
//    try {
//      const index = ((peer as any).headers as any).cookie.indexOf('auth:token')
//      if (index == -1) {
//        console.error('Invalid auth')
//        return
//      }
//
//      const token = ((peer as any).headers as any).cookie.substring(index + 11)
//      const s = await getAuthSession(token)
//      if (!s) {
//        console.error('Invalid auth for ws')
//        return
//      }
//
//      const ptoken = new Types.ObjectId(s.user_id)
//      console.log('Auth:', token)
//
//      peer.subscribe(ptoken.toString())
//
//      const rooms = await Room.find().where('senderId').equals(ptoken).exec()
//
//      console.log('Rooms:', rooms)
//
//      rooms.forEach((room) => {
//        console.log(`Subscribing ${s.user_id} to room ${room.conversationId}`)
//        peer.subscribe(room.conversationId.toString())
//      })
//    } catch (e) {
//      console.error(e)
//    }
//  },
//
//  message: async (peer: Peer, message: Message) => {
//    const data = JSON.parse(message.toString())
//    console.log('WS MESSAGE: ', data)
//
//    if (data.type == 'chat_message') {
//      try {
//        const room = await Room.findById(data.roomId)
//        if (!room) {
//          throw new Error('Room not found')
//        }
//
//        console.log(room)
//
//        const m = new DBMessage({
//          senderId: data.senderId,
//          content: data.content,
//          conversationId: room.conversationId
//        })
//
//        await m.save()
//
//        peer.publish(room.conversationId.toString(), {
//          type: 'chat_message',
//          content: data.content,
//          senderId: data.senderId
//        })
//      } catch (e) {
//        console.error(e)
//        return
//      }
//    }
//
//    if (data.type == 'room_add') {
//      const receiver = await User.findOne({ username: data.person })
//      if (!receiver) {
//        peer.send({ type: 'error', message: 'Receiver not found' })
//        throw new Error('Receiver not found')
//      }
//
//      await createRooms(data.senderId, data.person)
//
//      peer.publish((receiver._id as Types.ObjectId).toString(), {
//        type: 'room_add'
//      })
//      peer.send({ type: 'room_add' })
//    }
//  },
//
//  close: (peer: Peer) => {},
//
//  error: (peer: Peer, error: Error) => {
//    console.error('WS ERROR: ', error)
//  }
//})
