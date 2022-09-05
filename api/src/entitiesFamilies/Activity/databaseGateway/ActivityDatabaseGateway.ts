'use strict';

import Activity from '../entities/Activity';

export default interface ActivityDatabaseGateway {
  createActivity(role: Activity): Promise<Activity>;
  listAll(): Promise<Activity[]>;
  updateActivity(id: number, props: any): Promise<Activity>;
  findActivityById(id): Promise<Activity>;
  isActivityNameExist(name: string): Promise<boolean>;
  deleteActivityById(id: number): Promise<any>;
}
