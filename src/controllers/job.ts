import { IJobModel, JobModel }  from "../models/job"
import config                   from "config"
import _                        from "underscore"
import async                    from "async"
import { cacheWrapper }         from "./utils"





export const getAllActive = cacheWrapper("job.getAllActive", (done: DefaultResultCallback) => {
  
})