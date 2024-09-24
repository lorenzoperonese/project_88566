import { Schema, model } from 'mongoose'
import type { Types, Document } from 'mongoose'

export interface INoteCategory extends Document {
  name: string
  user_id: Types.ObjectId
}

const schema = new Schema<INoteCategory>(
  {
    name: { type: String, required: true },
    user_id: { type: Schema.Types.ObjectId, required: true, ref: 'users' }
  },
  {
    timestamps: true // Log when user is added and modified
  }
)

export default model<INoteCategory>('NoteCategory', schema, 'notesCategories')
