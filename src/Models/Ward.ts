import { Model, model, Schema, Types, Document } from "mongoose";

interface Ward extends Document {
  _id: Types.ObjectId;
  ward_id: string;
  name: string;
  gso_id: string;
  district_id: Types.ObjectId;
  created_at: string;
  updated_at: string;
}

// Statics Interface
interface WardModel extends Model<Ward> {}

const WardSchema: Schema<Ward> = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    unique: true,
  },
  ward_id: {
    type: String,
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
    type: Schema.Types.ObjectId,
  },
  created_at: {
    type: String,
  },
  updated_at: {
    type: String,
  },
});

const Ward = model<Ward, WardModel>("ward", WardSchema);

export { Ward, WardModel };
