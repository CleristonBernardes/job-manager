import { Document, Schema, model }     from "mongoose";
import IJobAssignment from "../interfaces/job_assignment";

const jobAssignmentSchema = new Schema({
  descrption: String,
  active: {
    type: Boolean,
    default: true
  },
  job: {
    data: Schema.Types.ObjectId, //for populate
    description: String,
    category: String
  },
  tradie: {
    data: Schema.Types.ObjectId, //for populate
    email: String,
    name: String
  }
}, { timestamps: true });

export interface IJobAssignmentModel extends IJobAssignment, Document {}
export const JobAssignmentModel = model<IJobAssignmentModel>("job_assignment", jobAssignmentSchema);