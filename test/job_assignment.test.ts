import * as config      from "config"
import * as Job         from "../src/controllers/job"
import * as Tradie      from "../src/controllers/tradie"
import * as JobAssign   from "../src/controllers/job_assignment"
import { testExecute }  from "./utils"
import * as async       from "async"
import * as mongoose    from "mongoose";

jasmine.DEFAULT_TIMEOUT_INTERVAL = config.test.DEFAULT_TIMEOUT_INTERVAL
// todo: create error messages as contantes and then on tests
describe("job_assignment", () => {
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
      expect(err).toBeUndefined();
      expect(job_assigns).toBeDefined();
      expect(job_assigns.length).toBeGreaterThanOrEqual(1);
      expect(job_assigns[0].job).toBeDefined();
      expect(job_assigns[0].job.data).toBeDefined();
      done();
    });
  });
  
  it(`assingTradieToJob`, done => {
    JobAssign.assingTradieToJob({
      job_id: mongoose.Types.ObjectId("5a1acaa8d91a8c5804336601"),
      tradie_id: mongoose.Types.ObjectId("5a1acaa8d91a8c5804336601"),
      description: "assingTradieToJob"
    }, (err: any, response: any) => {
      expect(err).toBeNull();
      expect(response).toBeDefined();
      expect(response.new_job_assign).toBeDefined();
      expect(response.new_job_assign.tradie).toBeDefined();
      expect(response.new_job_assign.tradie.data).toBeDefined();
      expect(response.new_job_assign.tradie.data.toString()).toBe("5a1acaa8d91a8c5804336601");
      expect(response.new_job_assign.job).toBeDefined();
      expect(response.new_job_assign.job.data).toBeDefined();
      expect(response.new_job_assign.job.data.toString()).toBe("5a1acaa8d91a8c5804336601");
      expect(response.updated_job).toBeDefined();
      expect(response.updated_job.status).toBeDefined();
      expect(response.updated_job.status).toBe("assigned");
      done();
    });
  });

  it(`assingTradieToJob already assigned`, done => {
    JobAssign.assingTradieToJob({
      job_id: mongoose.Types.ObjectId("5a1acaa8d91a8c5804336601"),
      tradie_id: mongoose.Types.ObjectId("5a1acaa8d91a8c5804336600"),
      description: "assingTradieToJob"
    }, (err: any, response: any) => {
      expect(err).toBeDefined();
      expect(response).toBeUndefined();
      done();
    });
  });

  it(`assingTradieToJob already hired`, done => {
    JobAssign.assingTradieToJob({
      job_id: mongoose.Types.ObjectId("5a1acaa8d91a8c5804336602"),
      tradie_id: mongoose.Types.ObjectId("5a1acaa8d91a8c5804336600"),
      description: "assingTradieToJob"
    }, (err: any, response: any) => {
      expect(err).toBeDefined();
      expect(response).toBeUndefined();
      done();
    });
  });

  it(`assingTradieToJob no tradie`, done => {
    JobAssign.assingTradieToJob({
      job_id: mongoose.Types.ObjectId("5a1acaa8d91a8c5804336601"),
      description: "assingTradieToJob"
    }, (err: any, response: any) => {
      expect(err).toBeDefined();
      expect(response).toBeUndefined();
      done();
    });
  });

  it(`assingTradieToJob no job`, done => {
    JobAssign.assingTradieToJob({
      tradie_id: mongoose.Types.ObjectId("5a1acaa8d91a8c5804336600"),
      description: "assingTradieToJob"
    }, (err: any, response: any) => {
      expect(err).toBeDefined();
      expect(response).toBeUndefined();
      done();
    });
  });

    
  it(`assingTradieToJob invalid job`, done => {
    JobAssign.assingTradieToJob({
      job_id: mongoose.Types.ObjectId("6a1acaa8d91a8c5804336601"),
      tradie_id: mongoose.Types.ObjectId("5a1acaa8d91a8c5804336601"),
      description: "assingTradieToJob"
    }, (err: any, response: any) => {
      expect(err).toBeDefined();
      expect(response).toBeUndefined();
      done();
    });
  });

      
  it(`assingTradieToJob invalid tradie`, done => {
    JobAssign.assingTradieToJob({
      job_id: mongoose.Types.ObjectId("5a1acaa8d91a8c5804336601"),
      tradie_id: mongoose.Types.ObjectId("6a1acaa8d91a8c5804336601"),
      description: "assingTradieToJob"
    }, (err: any, response: any) => {
      expect(err).toBeDefined();
      expect(response).toBeUndefined();
      done();
    });
  });

  it(`hireTradie`, done => {
    JobAssign.hireTradie({
      job_assign_id: job_assign["max_pipe"]._id
    }, (err: any, response: any) => {
      expect(err).toBeUndefined();
      expect(response).toBeDefined();
      expect(response.job_updated).toBeDefined();
      expect(response.job_updated.status).toBeDefined();
      expect(response.job_updated.status).toBe("hired");
      expect(response.tradie_updated).toBeDefined();
      expect(response.tradie_updated.jobs).toBeDefined();
      expect(response.tradie_updated.jobs).toHaveLength(1)
      done();
    });
  });


  it(`hireTradie invalid assignment`, done => {
    JobAssign.hireTradie({
      job_assign_id: mongoose.Types.ObjectId("6a1acaa8d91a8c5804336601")
    }, (err: any, response: any) => {
      expect(err).toBeDefined();
      expect(response).toBeUndefined();
      done();
    });
  });

});