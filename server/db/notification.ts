// This are the notifications inside the app. We can find them in the upper
// right corner of the navbar.

import type { Document, Types } from 'mongoose'
import { Schema, model } from 'mongoose'
import User from './user'

export interface INotification extends Document {
  title: string
  body: string
  read: boolean
  type?: string
  identifier?: string
  user_id: Types.ObjectId
  createdAt: Date
}

const schema = new Schema<INotification>(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    read: { type: Boolean, required: true },
    type: { type: String, required: true },
    identifier: { type: String },
    user_id: { type: Schema.Types.ObjectId, required: true, ref: User }
  },
  {
    timestamps: true // Log when user is added and modified
  }
)

export default model<INotification>('Notification', schema, 'notifications')
