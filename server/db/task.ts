import { Schema, model } from 'mongoose'
import type { Document, Types } from 'mongoose'

export interface ITask extends Document {
  title: string
  end: Date
  note?: string
  category?: string
  completed: boolean
  user_id: Types.ObjectId
}

const schema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    end: { type: Date, required: true },
    note: { type: String },
    category: { type: String },
    completed: { type: Boolean, required: true },
    user_id: { type: Schema.Types.ObjectId, required: true, ref: 'users' }
  },
  {
    timestamps: true // Log when user is added and modified
  }
)

export default model<ITask>('Task', schema, 'tasks')
