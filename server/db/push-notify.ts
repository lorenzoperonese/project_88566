import { Schema, model } from 'mongoose'
import type { Document, Types } from 'mongoose'
import User from './user'
import type { PushSubscription } from 'web-push'

export interface IPush extends Document {
  subscription: PushSubscription
  user_id: Types.ObjectId
}

const schema = new Schema<IPush>(
  {
    subscription: { type: Object, required: true },
    user_id: { type: Schema.Types.ObjectId, required: true, ref: User }
  },
  {
    timestamps: true // Log when user is added and modified
  }
)

export default model<IPush>('PushNotification', schema, 'pushNotifications')
