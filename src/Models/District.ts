import { Model, model, Schema } from "mongoose";
import { ExtendedDocument } from "../Database/Plugins/ExtendedSchema";

interface District {
  district_id: number;
  name: string;
  gso_id: string;
  province_id: number;
  created_at: string;
  updated_at: string;
}

// Methods Interface
interface DistrictDocument extends District, ExtendedDocument {}

// Statics Interface
interface DistrictModel extends Model<DistrictDocument> {}

const DistrictSchema: Schema<DistrictDocument> = new Schema({
  district_id: {
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
  province_id: {
    type: Number,
  },
  created_at: {
    type: String,
  },
  updated_at: {
    type: String,
  },
});

const District = model<DistrictDocument, DistrictModel>(
  "district",
  DistrictSchema
);

export { District, DistrictModel };
