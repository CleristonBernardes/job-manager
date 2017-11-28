import * as config      from "config"
import * as Tradie      from "../src/controllers/tradie"
import { testExecute }  from "./utils"
import * as async       from "async"

jasmine.DEFAULT_TIMEOUT_INTERVAL = config.test.DEFAULT_TIMEOUT_INTERVAL

describe("tradie", () => {
  const tradie_list = {}
  beforeAll((done) => {
    async.parallel({
      tradie_max: (n)=> { 
        Tradie.save({
          _id: "5a1acaa8d91a8c5804336600", name: "Max", email: "max@gmail.com"
        }, n) 
      },
      tradie_tomas: (n)=> { 
        Tradie.save({
          _id: "5a1acaa8d91a8c5804336601", name: "Tomas", email: "tomas@gmail.com"
        }, n) 
      }
    }, (err, {tradie_max, tradie_tomas}) => {
      tradie_list["tradie_max"] = tradie_max;
      tradie_list["tradie_tomas"] = tradie_tomas;
      done(err);
    });
  });

  it(`getAllActive`, done => {
    Tradie.getAllActive((err: any, tradies: any[]) => {
      expect(err).toBeUndefined();
      expect(tradies).toBeDefined();
      expect(tradies.length).toBeGreaterThanOrEqual(2);
      done();
    });
  });

  it(`getById`, done => {
    const id = tradie_list["tradie_max"]._id.toString();
    Tradie.getById({id}, (err: any, tradie: any) => {
      // console.info(err, "tradie", tradie)
      expect(err).toBeUndefined();
      expect(tradie).toBeDefined();
      expect(tradie._id.toString()).toBe(id);
      done();
    });
  });

  it(`save`, done => {
    Tradie.save({name: "Mary", email: "mary@gmail.com"}, (err: any, tradie: any) => {
      expect(err).toBeUndefined();
      expect(tradie).toBeDefined();
      expect(tradie.name).toBeDefined();
      expect(tradie.name).toBe("Mary");
      expect(tradie.email).toBeDefined();
      expect(tradie.email).toBe("mary@gmail.com");
      done();
    });
  });


});