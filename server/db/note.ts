import { Schema, model } from 'mongoose'
import type { Types, Document } from 'mongoose'

export interface INote extends Document {
  title: string
  body: string
  category_id?: Types.ObjectId
  user_id: Types.ObjectId
}

const schema = new Schema<INote>(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    category_id: { type: Schema.Types.ObjectId, ref: 'notesCategories' },
    user_id: { type: Schema.Types.ObjectId, required: true, ref: 'users' }
  },
  {
    timestamps: true // Log when user is added and modified
  }
)

export default model<INote>('Note', schema, 'notes')
