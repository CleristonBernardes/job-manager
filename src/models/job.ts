import { Document, Schema, model }     from "mongoose";
import IJob from "../interfaces/job";

const jobSchema = new Schema({
  postcode: String,
  category: String,
  description: String,
  customer_name: String,
  email: String,
  mobile: String,
  status: {
    type: String,
    default: "New",
    enum: ["New", "Assigned", "Hired"]
  },
  active: {
    type: Boolean,
    default: true
  }
}, { timestamps: false });

export interface IJobModel extends IJob, Document {}
export const JobModel = model<IJobModel>("job", jobSchema);