import { Schema, model, Types } from 'mongoose'
import type { Message } from 'vue-advanced-chat'
import User from './user'

interface IMessage extends Message {
  conversationId: Types.ObjectId
}

const schema = new Schema<IMessage>({
  senderId: { type: String, required: true, ref: User },
  content: { type: String },
  conversationId: { type: Schema.Types.ObjectId, required: true }
})

export default model<IMessage>('Message', schema, 'messages')
