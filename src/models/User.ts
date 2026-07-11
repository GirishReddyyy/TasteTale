import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: "admin" | "contributor";
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, required: true, enum: ["admin", "contributor"], default: "contributor" },
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
