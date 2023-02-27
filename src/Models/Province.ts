import { Model, model, Schema, Types, Document } from "mongoose";

interface Province extends Document {
  _id: Types.ObjectId;
  province_id: string;
  name: string;
  gso_id: string;
  created_at: string;
  updated_at: string;
}

// Statics Interface
interface ProvinceModel extends Model<Province> {}

const ProvinceSchema: Schema<Province> = new Schema({
  province_id: {
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
  created_at: {
    type: String,
  },
  updated_at: {
    type: String,
  },
});

const Province = model<Province, ProvinceModel>("province", ProvinceSchema);

export { Province, ProvinceModel };
