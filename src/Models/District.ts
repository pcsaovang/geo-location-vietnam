import { Model, model, Schema, Types, Document } from "mongoose";

interface District extends Document {
  _id: Types.ObjectId;
  district_id: string;
  name: string;
  gso_id: string;
  province_id: Types.ObjectId;
  created_at: string;
  updated_at: string;
}

// Statics Interface
interface DistrictModel extends Model<District> {}

const DistrictSchema: Schema<District> = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    unique: true,
  },
  district_id: {
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
  province_id: {
    type: Schema.Types.ObjectId,
  },
  created_at: {
    type: String,
  },
  updated_at: {
    type: String,
  },
});

const District = model<District, DistrictModel>("district", DistrictSchema);

export { District, DistrictModel };
