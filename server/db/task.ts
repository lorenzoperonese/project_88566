import { Schema, model } from 'mongoose'
import type { Document, Types } from 'mongoose'
import User from './user'

export interface ITask extends Document {
  title: string
  end: number
  note?: string
  category?: string
  completed: boolean
  user_id: Types.ObjectId
}

const schema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    end: { type: Number, required: true },
    note: { type: String, required: true },
    category: { type: String, required: true },
    completed: { type: Boolean, required: true },
    user_id: { type: Schema.Types.ObjectId, required: true, ref: User }
  },
  {
    timestamps: true // Log when user is added and modified
  }
)

export default model<ITask>('Task', schema, 'tasks')
