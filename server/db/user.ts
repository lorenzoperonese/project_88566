import { Schema, model } from 'mongoose'
import type { Document } from 'mongoose'
import bcrypt from 'mongoose-bcrypt'

export interface IUser extends Document {
  username: string
  password: string
  name: string
  verifyPassword(password: string): Promise<boolean> // Add this for type safety
}

const schema = new Schema<IUser>(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, bcrypt: true, required: true },
    name: { type: String, required: true }
  },
  {
    timestamps: true // Log when user is added and modified
  }
)

schema.plugin(bcrypt)

export default model<IUser>('User', schema, 'users')
