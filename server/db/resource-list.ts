import { Schema, model } from 'mongoose'
import type { Document } from 'mongoose'

export interface IResourceList extends Document {
  name: string
}

const schema = new Schema<IResourceList>(
  {
    name: { type: String, required: true }
  },
  {
    timestamps: true // Log when user is added and modified
  }
)

export default model<IResourceList>('ResourceList', schema, 'resourcesList')
