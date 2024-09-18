import mongoose from "mongoose";
import bcrypt from "mongoose-bcrypt";

const schema = new mongoose.Schema(
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

export default mongoose.model("User", schema, "users");
