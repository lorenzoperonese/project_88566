import type { Document, Types } from 'mongoose'
import { Schema, model } from 'mongoose'
import User from './user'

export interface INotification extends Document {
  title: string
  body: string
  read: boolean
  user_id: Types.ObjectId
  createdAt: Date
}

const schema = new Schema<INotification>(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    read: { type: Boolean, required: true },
    user_id: { type: Schema.Types.ObjectId, required: true, ref: User }
  },
  {
    timestamps: true // Log when user is added and modified
  }
)

export default model<INotification>('Notification', schema, 'notifications')
