import { Schema, model } from 'mongoose'
import type { Document, Types } from 'mongoose'
import User from './user'

export interface IEvent extends Document {
  title: string
  start: number
  end: number
  location?: string
  note?: string
  category?: string
  repetition?: {
    every: number
    period: number
    repeatOn?: number[] | number
    end?: number
  }
  notify?: {
    advance: number
    period: number
    hour: number
  }[]
  user_id: Types.ObjectId
}

const schema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    start: { type: Number, required: true },
    end: { type: Number, required: true },
    location: { type: String },
    note: { type: String },
    category: { type: String, required: true },
    repetition: { type: Object },
    notify: { type: Array },
    user_id: { type: Schema.Types.ObjectId, required: true, ref: User }
  },
  {
    timestamps: true // Log when user is added and modified
  }
)

export default model<IEvent>('Event', schema, 'events')
