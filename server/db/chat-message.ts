import type { Types } from 'mongoose'
import { Schema, model } from 'mongoose'
import User from './user'

interface Message {
  senderId: Types.ObjectId
  content: string
  conversationId: Types.ObjectId
}

const schema = new Schema<Message>({
  senderId: { type: Schema.Types.ObjectId, required: true, ref: User },
  content: { type: String },
  conversationId: { type: Schema.Types.ObjectId, required: true }
})

export default model<Message>('Message', schema, 'messages')
