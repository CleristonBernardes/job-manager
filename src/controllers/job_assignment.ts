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

export const getAllActive = (done: DefaultResultCallback) => {
  _JobAssignmentModel.find({active: true}, done);
};

export const deactivateAssignamentsByJob = (params: any, done: DefaultResultCallback) => {
  const {job_id} = params
  _JobAssignmentModel.update({"job.data": job_id}, {active: false}, {multi: true}, done);
};

export const assingTradieToJob = (params: any, done: DefaultResultCallback) => {
  const {job_id, tradie_id, description} = params
  if (!job_id) {return done(new Error("Inform the job."))}
  if (!tradie_id) {return done(new Error("Inform a tradie."))}
  async.parallel({
    job: (n) => {Job_Control.getById({id:job_id}, n)},
    tradie: (n) => {Tradie_Control.getById({id:tradie_id}, n)},
    job_assign: (n) => {_JobAssignmentModel.findOne({"job.data": job_id, "tradie.data": tradie_id}, n)}
  }, (err: Error, {job, tradie, job_assign})=>{
    if (err) {return done(err)}
    if (!job) {return done(new Error("Invalid job."))}
    if (!tradie) {return done(new Error("Invalid tradie."))}
    if (job_assign) {return done(new Error("Tradie already assigned to this job."))}
    async.parallel({
      new_job_assign: (n) => {
        save({
          description,
          job: {data: job._id, description: job.description, status: job.status},
          tradie: {data: tradie._id, email: tradie.email, name: tradie.name, is_hired: tradie.is_hired}
        }, n);
      },
      updated_job: (n) => {
        job.status = "assigned"
        Job_Control.save(job, n)
      }
    }, done);
  });
};

export const getAssignmentsByJob = (params: any, done: DefaultResultCallback) => {
  const {job_id} = params
  if (!job_id) {return done(new Error("Inform the job."))}
  _JobAssignmentModel.find({"job.data": job_id}, done);
}

export const hireTradie = (params: any, done: DefaultResultCallback) => {
  const {job_assign_id} = params;
  _JobAssignmentModel.findById(job_assign_id, (err: Error, job_assign: IJobAssignmentModel)=>{
    if (err) {return done(err)}
    if (!job_assign) {return done(new Error("Invalid assignment."))}
    async.parallel({
      job: (n) => {Job_Control.getById({id:job_assign.job.data}, n)},
      tradie: (n) => {Tradie_Control.getById({id:job_assign.tradie.data}, n)}
    }, (err: Error, {job,tradie})=>{
      if (err) {return done(err)}
      if (!job) {return done(new Error("Job not found for this assignment."))}
      if (!tradie) {return done(new Error("Tradie not found for this assignment."))}
      if (tradie.jobs && tradie.jobs.indexOf(job._id.toString()) > -1) { return done(new Error("The tradie is already hired for this job."))}
      if (job.status === "hired") { return done(new Error("There is another tradie hired for this job."))}
      tradie.jobs = tradie.jobs || []
      tradie.jobs.push(job._id.toString())
      job.status = "hired"
      async.parallel({
        job_updated: (n) => {Job_Control.save(job, n)},
        tradie_updated: (n) => {Tradie_Control.save(tradie, n)},
        job_assign_updated: (n) => {deactivateAssignamentsByJob({job_id: job._id}, n)}
      }, (err: Error, {job_updatedob, tradie_updated, job_assign_updated})=>{
        console.info("{job_updatedob, tradie_updated, job_assign_updated}", {job_updatedob, tradie_updated, job_assign_updated})
        done(undefined, {job_updatedob, tradie_updated})
      });
    });
  });
}