import * as Job_Control         from "./controllers/job"
import * as Tradie_Control      from "./controllers/tradie"
import * as Job_Assign_Control  from "./controllers/job_assignment"
import * as _         from 'underscore';
import * as config    from 'config';
import {
  Router,
  Request,
  Response,
  NextFunction
}  from 'express';

const router: Router = Router();

const getParameters = (req: Request) => {
  const _ip =req.header('x-forwarded-for') || req.connection.remoteAddress;
  return _.extend(req.params, req.query, req.body, {_ip});
}

const runMethod = (method, use_params=true) => {
  return (req: Request, res: Response, next: NextFunction) => {
    let params = getParameters(req);
    try{
      if (use_params){
        method(params, (err: Error, result: any) => {
          res.locals.error = err;
          res.locals.result = result;
          next(err);
        });
      } else {
        method((err: Error, result: any) => {
          res.locals.error = err;
          res.locals.result = result;
          next(err);
        });
      }
    }
    catch(err){
      res.locals.error = err;
      next(err);
    }
  }
}

const dispatch =  (req: Request, res: Response, next: NextFunction) => {
  if (res.locals.error) {
    res.status(config.api.status.error).send(res.locals.error.message);
  } else {
    res.status(config.api.status.success).send(res.locals.result);
  }
}


// GET
router.get(`/jobs`, runMethod(Job_Control.getAllActive, false), dispatch);
router.get(`/tradies`, runMethod(Tradie_Control.getAllActive, false), dispatch);
router.get(`/job/:id`, runMethod(Job_Control.getById), dispatch);
router.get(`/tradie/:id`, runMethod(Tradie_Control.getById), dispatch);
router.get(`/jobs/assignments/:job_id`, runMethod(Job_Assign_Control.getAssignmentsByJob), dispatch);

// POST
router.post(`/job`, runMethod(Job_Control.save), dispatch);
router.post(`/tradie`, runMethod(Tradie_Control.save), dispatch);
router.post(`/assign`, runMethod(Job_Assign_Control.assingTradieToJob), dispatch);
router.post(`/hire/:job_assign_id`, runMethod(Job_Assign_Control.hireTradie), dispatch);


export default router;