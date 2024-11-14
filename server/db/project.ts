import type { Document, Types } from 'mongoose'
import { Schema, model } from 'mongoose'
import User from './user'

export interface IProject extends Document {
  title: string
  description: string
  guests: {
    waiting: Types.ObjectId[]
    accepted: Types.ObjectId[]
  }
  user_id: Types.ObjectId
}

const schema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    guests: {
      waiting: [{ type: Schema.Types.ObjectId, required: true, ref: User }],
      accepted: [{ type: Schema.Types.ObjectId, required: true, ref: User }]
    },
    user_id: { type: Schema.Types.ObjectId, required: true, ref: User }
  },
  {
    timestamps: true
  }
)

export default model<IProject>('Project', schema, 'projects')
