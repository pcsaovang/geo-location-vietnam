import { Model, model, Schema } from "mongoose";
import { ExtendedDocument } from "../Database/Plugins/ExtendedSchema";

interface Province {
  province_id: number;
  name: string;
  gso_id: string;
  created_at: string;
  updated_at: string;
}

// Methods Interface
interface ProvinceDocument extends Province, ExtendedDocument {}

// Statics Interface
interface ProvinceModel extends Model<ProvinceDocument> {}

const ProvinceSchema: Schema<ProvinceDocument> = new Schema({
  province_id: {
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
  created_at: {
    type: String,
  },
  updated_at: {
    type: String,
  },
});

const Province = model<ProvinceDocument, ProvinceModel>(
  "province",
  ProvinceSchema
);

export { Province, ProvinceModel };
