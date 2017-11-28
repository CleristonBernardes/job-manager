export default interface IJobAssignment {
  descrption?: string;
  active: boolean;
  job: {
    data: any;
    description?: string;
    category?: string;
  };
  tradie: {
    data: any;
    email?: string;
    name?: string;
  }
}