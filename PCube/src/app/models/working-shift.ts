import { Shift } from './shift';

export class WorkingShift{
    date:Date;
    shift:Shift[];
  
    constructor(date:Date) {
      this.date = date;
      this.shift = [];
    }
  
    public addShift(shift:Shift){
      this.shift.push(shift);
    }
}
  
  