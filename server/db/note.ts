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
  todos?: {
    title: string
    end: number
    done: boolean
  }[]
  updatedAt: Date
  createdAt: Date
}

const schema = new Schema<INote>(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    category_id: { type: Schema.Types.ObjectId, ref: NoteCategory },
    user_id: { type: Schema.Types.ObjectId, required: true, ref: User },
    state: { type: String, required: true, default: 'private' },
    shared_with: [{ type: Schema.Types.ObjectId, ref: User }],
    todos: [
      {
        title: { type: String, required: true },
        end: { type: Number, required: true },
        done: { type: Boolean, required: true, default: false }
      }
    ]
  },
  {
    timestamps: true
  }
)

export default model<INote>('Note', schema, 'notes')
