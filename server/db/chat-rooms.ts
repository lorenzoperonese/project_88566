import { Schema, model } from 'mongoose'
import type { Types } from 'mongoose'
import type { Room } from 'vue-advanced-chat'
import RoomUser from './chat-room-user'
import User from './user'

interface IRoom extends Room {
  user_id: Types.ObjectId
}

const schema = new Schema<IRoom>({
  roomId: { type: String, required: true, unique: true },
  roomName: { type: String, required: true },
  avatar: { type: String, required: true },
  users: {
    type: [{ type: Schema.Types.ObjectId, ref: RoomUser }],
    required: true
  },
  unreadCount: { type: Number },
  index: { type: Date },
  lastMessage: { type: Object },
  typingUsers: { type: [String] },
  user_id: { type: Schema.Types.ObjectId, required: true, ref: User }
})

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.roomId = ret._id
    delete ret._id
  }
})

export default model<IRoom>('Room', schema, 'rooms')
