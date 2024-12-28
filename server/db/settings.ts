import { Schema, model } from 'mongoose'
import type { Document, Types } from 'mongoose'
import User from './user'

const HomeSettingsSchema = new Schema<HomeSettings>({
  showCalendar: { type: Boolean, required: true, default: true },
  showNotes: { type: Boolean, required: true, default: true },
  showPomodoro: { type: Boolean, required: true, default: true },
  showChat: { type: Boolean, required: true, default: true },
  showProjects: { type: Boolean, required: true, default: true },
  calendarFilter: { type: String, required: true, default: 'all' },
  notesFilter: { type: String, required: true, default: 'all' },
  pomodoroShowTimeIfPaused: { type: Boolean, required: true, default: true },
  chatShowHub: { type: Boolean, required: true, default: true },
  chatLimit: { type: Number, required: true, default: 10 },
  projectsLimit: { type: Number, required: true, default: 10 }
})

export interface ISettings extends Document {
  home: HomeSettings
  user_id: Types.ObjectId
}

const schema = new Schema<ISettings>(
  {
    home: { type: HomeSettingsSchema, required: true },
    user_id: { type: Schema.Types.ObjectId, required: true, ref: User }
  },
  {
    timestamps: true // Log when user is added and modified
  }
)

export default model<ISettings>('Settings', schema, 'settings')
