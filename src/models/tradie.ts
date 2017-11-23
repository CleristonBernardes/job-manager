import { Document, Schema, model }     from "mongoose";
import ITradie from "../interfaces/tradie";

const tradieSchema = new Schema({
  mobile: String,
  email: String,
  name: String
}, { timestamps: false });

export interface ITradieModel extends ITradie, Document {}
export const TradieModel = model<ITradieModel>("tradie", tradieSchema);