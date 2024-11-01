import { Schema, model } from 'mongoose'
import type { Types } from 'mongoose'
import type { RoomUser } from 'vue-advanced-chat'

const schema = new Schema<RoomUser>({
  username: { type: String, required: true },
  avatar: { type: String, required: true },
  status: { type: Object, required: true }
})

export default model<RoomUser>('RoomUser', schema, 'roomUsers')
