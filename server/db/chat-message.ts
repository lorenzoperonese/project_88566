import { Schema, model, Types } from 'mongoose'
import type { Message } from 'vue-advanced-chat'
import User from './user'
import Room from './chat-rooms'

interface IMessage extends Message {
  roomId: Types.ObjectId
}

const schema = new Schema<IMessage>({
  senderId: { type: String, required: true, ref: User },
  content: { type: String },
  roomId: { type: Schema.Types.ObjectId, required: true, ref: Room }
})

export default model<IMessage>('Message', schema, 'messages')
