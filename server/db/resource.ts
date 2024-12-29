import { Schema, model } from 'mongoose'
import type { Document } from 'mongoose'

export interface IResource extends Document {
  title: string
  start: number
  end: number
  note?: string
}

const schema = new Schema<IResource>(
  {
    title: { type: String, required: true },
    start: { type: Number, required: true },
    end: { type: Number, required: true },
    note: { type: String }
  },
  {
    timestamps: true // Log when user is added and modified
  }
)

export default model<IResource>('Resource', schema, 'resources')
