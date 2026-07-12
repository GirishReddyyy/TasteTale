import mongoose, { Schema, Document, Types } from "mongoose";

export interface IRecipe extends Document {
  title: string;
  slug: string;
  tags: string[];
  backgroundImageUrl: string;
  ingredientsHtml: string;
  stepsHtml: string;
  cookTimeVariants: {
    stove?: { time: string; notes: string };
    oven?: { time: string; notes: string };
    airfryer?: { time: string; notes: string };
  };
  theme: {
    titleFont: string;
    titleColor: string;
    bodyFont: string;
    bodyColor: string;
    accentColor: string;
  };
  authorId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isVisible?: boolean;
}

const RecipeSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    tags: [{ type: String }],
    backgroundImageUrl: { type: String, required: true },
    ingredientsHtml: { type: String, required: true },
    stepsHtml: { type: String, required: true },
    cookTimeVariants: {
      stove: { time: String, notes: String },
      oven: { time: String, notes: String },
      airfryer: { time: String, notes: String },
    },
    theme: {
      titleFont: { type: String, default: "Caveat" },
      titleColor: { type: String, default: "#333333" },
      bodyFont: { type: String, default: "Inter" },
      bodyColor: { type: String, default: "#444444" },
      accentColor: { type: String, default: "#fbcfe8" },
    },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Recipe || mongoose.model<IRecipe>("Recipe", RecipeSchema);
