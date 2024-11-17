import { Document, Types } from 'mongoose'
import { Schema, model } from 'mongoose'

export interface IProjectTask extends Document {
  title: string
  description: string
  phase: string
  user_id: Types.ObjectId
  state: string
  start: number
  end: number
  dependency: Types.ObjectId | null
  project_id: Types.ObjectId
}

const schema = new Schema<IProjectTask>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    phase: { type: String, required: true },
    user_id: { type: Schema.Types.ObjectId, required: true },
    state: { type: String, required: true, default: 'pending' },
    start: { type: Number, required: true },
    end: { type: Number, required: true },
    dependency: { type: Schema.Types.ObjectId, ref: 'ProjectTask' },
    project_id: { type: Schema.Types.ObjectId, required: true }
  },
  {
    timestamps: true
  }
)

export default model<IProjectTask>('ProjectTask', schema, 'projectTasks')
