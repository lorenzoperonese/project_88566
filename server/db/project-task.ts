import type { Document, Types, Schema, model  } from 'mongoose'

export interface IProjectTask extends Document {
  title: string
  description: string
  phase: string
  user_id: Types.ObjectId
  state: string
  start: number
  end: number
  input: string
  output: string
  translation: boolean // The activity needs to be translated if dependency is not met in time
  milestone: boolean // The activity is a milestone
  subtasks: {
    title: string
    done: boolean
  }[]
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
    input: { type: String },
    output: { type: String, required: true },
    translation: { type: Boolean, required: true, default: false },
    milestone: { type: Boolean, required: true, default: false },
    subtasks: [
      {
        title: { type: String, required: true },
        done: { type: Boolean, required: true, default: false }
      }
    ],
    dependency: { type: Schema.Types.ObjectId, ref: 'ProjectTask' },
    project_id: { type: Schema.Types.ObjectId, required: true }
  },
  {
    timestamps: true
  }
)

export default model<IProjectTask>('ProjectTask', schema, 'projectTasks')
