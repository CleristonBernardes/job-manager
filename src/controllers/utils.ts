import * as node_cache          from "node-cache"
import * as config              from "config"
import * as _                   from "underscore"
import * as async               from "async"

const cache = new node_cache( { checkperiod: config.api.cache_time } ); //10seg
const _test_ = (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === "test");

export const cacheWrapper = (cache_key: string, method: Function): DefaultMethod =>{
  return (params: any, done: DefaultResultCallback): void => {
    const { ignore_cache } = params
    if(!done){
      done = params;
      params = undefined;
    }
    cache.get(cache_key, (err: Error, value: any) =>{
      if (!err && value && !ignore_cache){
        done(undefined, value)
      } else {
        async.waterfall([
          (n) => {
            if (params) {
              method(params, (err: Error, response: any) =>{
                n(err, response)
              });
            } else { 
              method((err: Error, response: any) =>{
                n(err, response)
              });
            }
          },
          (response: any, n) => {
            cache.set (cache_key, response, (err: Error, result: any) =>{
              if (err) {console.error("Error while caching api result: API - #{cache_key} ERROR - #{err}") }
              n(undefined, response)
            });
          }], done
        );
      }
    });
  }
}

export const setSave = (_Model: any): DefaultMethod =>{
  return (params: any, done: DefaultResultCallback) => {
    if (_test_){
      params = params.toObject? params.toObject() : params;
      _Model.save(params, done);
    }else{
      const new_key = new _Model(params);
      new_key.save(done);
    }
  }
}