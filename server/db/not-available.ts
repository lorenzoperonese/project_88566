import { Schema, model } from 'mongoose'
import type { Document, Types } from 'mongoose'
import User from './user'

export interface INotAvailable extends Document {
  start: number
  end: number
  user_id: Types.ObjectId
}

const schema = new Schema<INotAvailable>(
  {
    start: { type: Number, required: true },
    end: { type: Number, required: true },
    user_id: { type: Schema.Types.ObjectId, required: true, ref: User }
  },
  {
    timestamps: true // Log when user is added and modified
  }
)

export default model<INotAvailable>('NotAvailable', schema, 'notAvailable')
