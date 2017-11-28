import * as config      from "config"
import * as Job         from "../src/controllers/job"
import * as Tradie      from "../src/controllers/tradie"
import * as JobAssign   from "../src/controllers/job_assignment"
import { testExecute }  from "./utils"
import * as async       from "async"
import * as mongoose    from "mongoose";

jasmine.DEFAULT_TIMEOUT_INTERVAL = config.test.DEFAULT_TIMEOUT_INTERVAL

describe("key_manager", () => {
  const job_list = {}
  const tradie_list = {}
  const job_assign = {}
  beforeAll((done) => {
    async.parallel({
      job_new: (n)=> { 
        Job.save({
          _id: "5a1acaa8d91a8c5804336600", category: "garden", description: "Garden cleaner", email: "thegarden@gmail.com"
        }, n) 
      },
      assigned: (n)=> { 
        Job.save({
          _id: "5a1acaa8d91a8c5804336601", category: "pipe", description: "Garden cleaner", email: "thegarden@gmail.com", status: "assigned"
        }, n) 
      },
      hired: (n)=> { 
        Job.save({
          _id: "5a1acaa8d91a8c5804336602", category: "teatcher", description: "Tradie courses", email: "teach@gmail.com", status: "hired"
        }, n) 
      },
      tradie_max: (n)=> { 
        Tradie.save({
          _id: "5a1acaa8d91a8c5804336600", name: "Max", email: "max@gmail.com"
        }, n) 
      },
      tradie_tomas: (n)=> { 
        Tradie.save({
          _id: "5a1acaa8d91a8c5804336601", name: "Tomas", email: "tomas@gmail.com"
        }, n) 
      },
      max_pipe: (n)=> { 
        JobAssign.assingTradieToJob({
          job_id: "5a1acaa8d91a8c5804336601", tradie_id: "5a1acaa8d91a8c5804336600", description: "test"
        }, n) 
      }
    }, (err, {job_new, assigned, hired, tradie_max, tradie_tomas, max_pipe}) => {
      // console.info("max_pipe", max_pipe)
      job_list["job_new"] = job_new;
      job_list["assigned"] = assigned;
      job_list["hired"] = hired;
      tradie_list["tradie_max"] = tradie_max;
      tradie_list["tradie_tomas"] = tradie_tomas;
      job_assign["max_pipe"] = max_pipe.new_job_assign;
      done(err);
    });
  });

  it(`getAssignmentsByJob`, done => {
    JobAssign.getAssignmentsByJob({job_id: mongoose.Types.ObjectId("5a1acaa8d91a8c5804336601")}, (err: any, job_assigns: any[]) => {
      // console.info(job_assigns, "job_assigns")
      expect(err).toBeUndefined();
      expect(job_assigns).toBeDefined();
      expect(job_assigns.length).toBeGreaterThanOrEqual(1);
      done();
    });
  });
  
  it(`assingTradieToJob`, done => {
    JobAssign.assingTradieToJob({
      job_id: mongoose.Types.ObjectId("5a1acaa8d91a8c5804336601"),
      tradie_id: mongoose.Types.ObjectId("5a1acaa8d91a8c5804336601"),
      description: "assingTradieToJob"
    }, (err: any, response: any[]) => {
      expect(err).toBeNull();
      expect(response).toBeDefined();
      done();
    });
  });

  it(`assingTradieToJob invalid`, done => {
    JobAssign.assingTradieToJob({
      job_id: mongoose.Types.ObjectId("5a1acaa8d91a8c5804336601"),
      tradie_id: mongoose.Types.ObjectId("5a1acaa8d91a8c5804336600"),
      description: "assingTradieToJob"
    }, (err: any, response: any[]) => {
      // console.info(err,"any", response)
      expect(err).toBeDefined();
      expect(response).toBeUndefined();
      done();
    });
  });

  it(`hireTradie`, done => {
    JobAssign.hireTradie({
      job_assign_id: job_assign["max_pipe"]._id
    }, (err: any, response: any[]) => {
      // console.info(err, "any", response)
      expect(err).toBeUndefined();
      expect(response).toBeDefined();
      done();
    });
  });


});