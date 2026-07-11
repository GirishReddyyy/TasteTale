import mongoose, { Schema, Document, Types } from "mongoose";

export interface IComment extends Document {
  recipeId: Types.ObjectId;
  userId: Types.ObjectId;
  text: string;
  imageUrl?: string;
  createdAt: Date;
}

const CommentSchema: Schema = new Schema({
  recipeId: { type: Schema.Types.ObjectId, ref: "Recipe", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  imageUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);
