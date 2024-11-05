import type { Types } from 'mongoose'
import { Schema, model } from 'mongoose'
import User from './user'

interface Room {
  roomName: string
  senderId: Types.ObjectId
  receiverId: Types.ObjectId
  conversationId: Types.ObjectId
}

const schema = new Schema<Room>({
  roomName: { type: String, required: true },
  senderId: { type: Schema.Types.ObjectId, required: true, ref: User },
  receiverId: { type: Schema.Types.ObjectId, required: true, ref: User },
  conversationId: { type: Schema.Types.ObjectId }
})

export default model<Room>('Room', schema, 'rooms')
