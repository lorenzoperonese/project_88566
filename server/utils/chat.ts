import { User, Room, Message } from '@/server/db'
import { Types } from 'mongoose'

export async function createChatRooms(user_id: string, receiver_id: string) {
  const receiver_user = await User.findById(receiver_id)

  if (!receiver_user) {
    throw new Error('Receiver not found')
  }

  const room = await Room.findOne({
    roomName: receiver_user.username,
    senderId: user_id,
    receiverId: receiver_user._id
  })

  if (room) {
    throw new Error('Room already exists')
  }

  const sender_user = await User.findById(user_id)

  if (!sender_user) {
    throw new Error('Sender not found: ' + user_id)
  }

  const conversationId = new Types.ObjectId()

  const r = new Room({
    roomName: receiver_user.username,
    senderId: user_id,
    receiverId: receiver_user._id,
    conversationId: conversationId
  })

  const r2 = new Room({
    roomName: sender_user.username,
    senderId: receiver_user._id,
    receiverId: user_id,
    conversationId: conversationId
  })

  await r.save()
  await r2.save()
}

export async function sendChatMessage(
  room_id: string,
  content: string,
  sender_id: string
) {
  const room = await Room.findById(room_id)
  if (!room) {
    throw new Error('Room not found')
  }

  await Message.create({
    senderId: sender_id,
    content: content,
    conversationId: room.conversationId
  })
}

export async function getReceiverFromRoom(room_id: string) {
  const room = await Room.findById(room_id)
  if (!room) {
    throw new Error('Room not found')
  }

  return room.receiverId.toString()
}
