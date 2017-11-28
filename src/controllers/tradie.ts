import { ITradieModel, TradieModel }  from "../models/tradie"
import * as config              from "config"
import * as _                   from "underscore"
import * as async               from "async"
import {
  cacheWrapper,
  setSave
} from "./utils"
import { Model }                from "mongoose"
import { Mock }                 from "../models/mock/mocks"

let _TradieModel: Model<ITradieModel>;
const _test_ = (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === "test");


if (_test_){
  // console.info("Testing mocked data.");
  _TradieModel = new Mock<ITradieModel>(TradieModel);
}else {
  _TradieModel = TradieModel;
}

export const save = setSave(_TradieModel);

export const getAllActive = cacheWrapper("tradie.getAllActive", (done: DefaultResultCallback) => {
  _TradieModel.find({active: true}, done);
});

export const getById = (params: any, done: DefaultResultCallback) => {
  const {id} = params;
  _TradieModel.findById(id, done);
};