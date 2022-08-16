import { Model, model, Schema } from "mongoose";
import { ExtendedDocument } from "../Database/Plugins/ExtendedSchema";

interface Ward {
  ward_id: number;
  name: string;
  gso_id: string;
  district_id: number;
  created_at: string;
  updated_at: string;
}

// Methods Interface
interface WardDocument extends Ward, ExtendedDocument {}

// Statics Interface
interface WardModel extends Model<WardDocument> {}

const WardSchema: Schema<WardDocument> = new Schema({
  ward_id: {
    type: Number,
    unique: true,
  },
  name: {
    type: String,
    trim: true,
  },
  gso_id: {
    type: String,
  },
  district_id: {
    type: Number,
  },
  created_at: {
    type: String,
  },
  updated_at: {
    type: String,
  },
});

const Ward = model<WardDocument, WardModel>("ward", WardSchema);

export { Ward, WardModel };
