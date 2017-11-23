import node_cache               from "node-cache"
import config                   from "config"
import _                        from "underscore"
import async                    from "async"

const cache = new node_cache( { checkperiod: config.api.cache_time } ); //10seg

export const cacheWrapper = (cache_key: string, method: Function): DefaultMethod =>{
  return (params: any, done: DefaultResultCallback): void => {
    if(!done){
      params = done;
      done = undefined;
    }
    cache.get(cache_key, (err: Error, value: any) =>{
      if (!err && value){
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