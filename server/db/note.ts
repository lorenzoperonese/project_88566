import { Schema, model } from 'mongoose'
import type { Document, Types } from 'mongoose'

export interface INote extends Document {
  title: string
  body: string
  user_id: Types.ObjectId
}

const schema = new Schema<INote>(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    user_id: { type: Schema.Types.ObjectId, required: true, ref: 'users' }
  },
  {
    timestamps: true // Log when user is added and modified
  }
)

export default model<INote>('Note', schema, 'notes')
