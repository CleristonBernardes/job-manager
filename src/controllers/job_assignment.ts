import { IJobAssignmentModel, JobAssignmentModel }  from "../models/job_assignment"
import * as Job_Control         from "../controllers/job"
import * as Tradie_Control      from "../controllers/tradie"
import * as config              from "config"
import * as _                   from "underscore"
import * as async               from "async"
import {
  cacheWrapper,
  setSave
} from "./utils"
import { Model }                from "mongoose"
import { Mock }                 from "../models/mock/mocks"

let _JobAssignmentModel: Model<IJobAssignmentModel>;
const _test_ = (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === "test");


if (_test_){
  // console.info("Testing mocked data.");
  _JobAssignmentModel = new Mock<IJobAssignmentModel>(JobAssignmentModel);
}else {
  _JobAssignmentModel = JobAssignmentModel;
}

export const save = setSave(_JobAssignmentModel);

export const assingTradieToJob = (params: any, done: DefaultResultCallback) => {
  const {job_id, tradie_id, description} = params
  if (!job_id) {return done(new Error("Inform the job."))}
  if (!tradie_id) {return done(new Error("Inform a tradie."))}
  async.parallel({
    job: (n) => {Job_Control.getById(job_id, n)},
    tradie: (n) => {Tradie_Control.getById(tradie_id, n)},
    job_assign: (n) => {_JobAssignmentModel.findOne({"job.data": job_id, "tradie.data": tradie_id}, n)}
  }, (err: Error, {job, tradie, job_assign})=>{
    if (!job) {return done(new Error("Invalid job."))}
    if (!tradie) {return done(new Error("Invalid tradie."))}
    if (job_assign) {return done(new Error("Tradie already assigned to this job."))}
    save({
      description
    } , done);
  });
};