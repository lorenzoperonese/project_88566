import { Schema, model } from 'mongoose'
import type { Types, Document } from 'mongoose'
import User from './user'
import NoteCategory from './note-category'

export interface INote extends Document {
  title: string
  body: string
  category_id?: Types.ObjectId
  user_id: Types.ObjectId
  state: string // private, shared, public
  shared_with: Types.ObjectId[]
  updatedAt: Date
}

const schema = new Schema<INote>(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    category_id: { type: Schema.Types.ObjectId, ref: NoteCategory },
    user_id: { type: Schema.Types.ObjectId, required: true, ref: User },
    state: { type: String, required: true, default: 'private' },
    shared_with: [{ type: Schema.Types.ObjectId, ref: User }]
  },
  {
    timestamps: true // Log when user is added and modified
  }
)

export default model<INote>('Note', schema, 'notes')
