import { User, Room } from '@/server/db'
import { Types } from 'mongoose'

export async function createRooms(user_id: string, receiver: string) {
  const receiver_user = await User.findOne({
    username: receiver
  })

  if (!receiver_user) {
    throw new Error('Receiver not found')
  }

  const room = await Room.findOne({
    roomName: receiver,
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
    roomName: receiver,
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
