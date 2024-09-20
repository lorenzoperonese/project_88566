import { Schema, model, connect } from "mongoose";
import bcrypt from "mongoose-bcrypt";

export interface IUser {
  username: string;
  password: string;
  name: string;
}

const schema = new Schema<IUser>(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, bcrypt: true, required: true },
    name: { type: String, required: true },
  },
  {
    timestamps: true, // Log when user is added and modified
  },
);

schema.plugin(bcrypt);

export default model<IUser>("User", schema, "users");
