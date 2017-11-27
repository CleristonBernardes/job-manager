import * as config      from "config"
import * as Job   from "../src/controllers/job"
import { testExecute }  from "./utils"
import * as async       from "async"

jasmine.DEFAULT_TIMEOUT_INTERVAL = config.test.DEFAULT_TIMEOUT_INTERVAL

describe("key_manager", () => {
  const job_list = {}
  beforeAll((done) => {
    async.parallel({
      job_new: (n)=> { 
        Job.save({
          _id: "5a1acaa8d91a8c5804336600", category: "garden", description: "Garden cleaner", email: "thegarden@gmail.com"
        }, n) 
      },
      assigned: (n)=> { 
        Job.save({
          _id: "5a1acaa8d91a8c5804336601", category: "garden", description: "Garden cleaner", email: "thegarden@gmail.com", status: "assigned"
        }, n) 
      },
      hired: (n)=> { 
        Job.save({
          _id: "5a1acaa8d91a8c5804336602", category: "garden", description: "Garden cleaner", email: "thegarden@gmail.com", status: "hired"
        }, n) 
      }
    }, (err, {job_new, assigned, hired}) => {
      // console.info( {job_new, assigned, hired})
      job_list["job_new"] = job_new;
      job_list["assigned"] = assigned;
      job_list["hired"] = hired;
      done(err);
    });
  });

  it(`getAllActive`, done => {
    Job.getAllActive((err: any, jobs: any[]) => {
      expect(err).toBeUndefined();
      expect(jobs).toBeDefined();
      expect(jobs.length).toBeGreaterThanOrEqual(3);
      done();
    });
  });

  it(`getById`, done => {
    const id = job_list["job_new"]._id.toString();
    Job.getById({id}, (err: any, job: any) => {
      // console.info(err, "job", job)
      expect(err).toBeUndefined();
      expect(job).toBeDefined();
      expect(job._id.toString()).toBe(id);
      done();
    });
  });


});