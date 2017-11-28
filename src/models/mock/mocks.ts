import * as _                     from "underscore"
import * as mongoose              from "mongoose"
import { Model, Document, Types } from "mongoose";
import { flatten, unflatten }     from "flat";


export class Mock<T extends Document> {
  protected list_data: any[]
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
    this.list_data = [];
  }
  public save = (new_obj: any, done: DefaultResultCallback) => {
    let db_obj: any;
    if (new_obj._id){
      for (const data of this.list_data){
        if (data._id.toString === new_obj._id.toString){
          const updated_data = _.extend(flatten(data.toObject()), flatten(new_obj));
          return done(undefined, unflatten(updated_data));
        }
      }
    }else {
      new_obj._id = mongoose.Types.ObjectId().toString();
    }
    try{
      db_obj = new this.model(new_obj);
    } catch (err) {
      return done(err);
    }
    this.list_data.push(db_obj);
    done(undefined, db_obj);
  }

  public findById = (id: any, done:DefaultResultCallback) => {
    if (!id) {return done(new Error("Invalid id."));}
    done(undefined, _.find(this.list_data, (l)=> { return l._id.toString() === id.toString()}));
  }

  private findSync = (params: any) => {
    params = params || {};
    const temp_list = this.list_data.map((d) => { return flatten(d.toObject()); });
    let filtered = _.where(temp_list, params);
    return filtered.map((d) => { return unflatten(d); });
  }

  public find = (params: any, done:DefaultResultCallback) => {
    done(undefined, this.findSync(params));
  }

  private findOneSync = (params: any) => {
    params = params || {};
    const temp_list = this.list_data.map((d) => { return flatten(d.toObject()); });
    return unflatten(_.findWhere(this.list_data, params));
  }

  public findOne = (params: any, done:DefaultResultCallback) => {
    done(undefined, this.findOneSync(params));
  }

  public update = (conditions:any, update: any, options: any, done:DefaultResultCallback) => {
    const to_update = options.multi ? this.findSync(conditions) : this.findOneSync(conditions);
    for (let data of this.list_data){
      if (_.findWhere([data], conditions)){
        data = _.extend(flatten(data.toObject()), flatten(update));
      }
    }
    done(undefined, this.list_data)
  }
}
