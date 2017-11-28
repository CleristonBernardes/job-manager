import { Document, Schema, model }     from "mongoose";
import ITradie from "../interfaces/tradie";

const tradieSchema = new Schema({
  mobile: String,
  email: String,
  name: String,
  active: {
    type: Boolean,
    default: true
  },
  jobs: [String]
}, { timestamps: true });

export interface ITradieModel extends ITradie, Document {}
export const TradieModel = model<ITradieModel>("tradie", tradieSchema);