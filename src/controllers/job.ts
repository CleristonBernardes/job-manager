import { IJobModel, JobModel }  from "../models/job"
import * as config              from "config"
import * as _                   from "underscore"
import * as async               from "async"
import {
  cacheWrapper,
  setSave
}from "./utils"
import { Model }                from "mongoose"
import { Mock }                 from "../models/mock/mocks"

let _JobModel: Model<IJobModel>;
const _test_ = (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === "test");


if (_test_){
  // console.info("Testing mocked data.");
  _JobModel = new Mock<IJobModel>(JobModel);
}else {
  _JobModel = JobModel;
}

export const save = setSave(_JobModel);

export const getAllActive = cacheWrapper("job.getAllActive", (done: DefaultResultCallback) => {
  _JobModel.find({active: true}, done);
});

export const getById = (params: any, done: DefaultResultCallback) => {
  const {id} = params;
  _JobModel.findById(id, done);
};

export const assingTradieToJob = (params: any, done: DefaultResultCallback) => {
  const {job_id, tradie_id} = params
  if (!job_id) {return done(new Error("Inform the job."))}
  if (!tradie_id) {return done(new Error("Inform a tradie."))}
  const {id} = params;
  _JobModel.findById(id, done);
};