import { Schema, model } from 'mongoose'
import type { Document, Types } from 'mongoose'

export interface IResource extends Document {
  title: string
  start: number
  end: number
  note?: string
  event_id?: Types.ObjectId
}

const schema = new Schema<IResource>(
  {
    title: { type: String, required: true },
    start: { type: Number, required: true },
    end: { type: Number, required: true },
    note: { type: String },
    event_id: { type: Schema.Types.ObjectId, ref: 'Event', default: null }
  },
  {
    timestamps: true // Log when user is added and modified
  }
)

export default model<IResource>('Resource', schema, 'resources')
