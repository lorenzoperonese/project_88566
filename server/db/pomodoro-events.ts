import { Schema, model } from 'mongoose'
import type { Document, Types } from 'mongoose'
import User from './user'

export interface IPomodoroEvent extends Document {
  title: string
  date: number
  study: number
  break: number
  cycles: number
  user_id: Types.ObjectId
}

const schema = new Schema<IPomodoroEvent>(
  {
    title: { type: String, required: true },
    date: { type: Number, required: true },
    study: { type: Number, required: true },
    break: { type: Number, required: true },
    cycles: { type: Number, required: true },
    user_id: { type: Schema.Types.ObjectId, required: true, ref: User }
  },
  {
    timestamps: true // Log when user is added and modified
  }
)

export default model<IPomodoroEvent>('PomodorEvent', schema, 'pomodoroEvents')
