'use strict';

import { UseCaseActivator } from '../../../system/Requestors/UseCaseActivator';
import { CreateActivityRequest } from './CreateActivityRequest';
import Activity from '../../../entitiesFamilies/Activity/entities/Activity';
import ActivityDatabaseGateway from '../../../entitiesFamilies/Activity/databaseGateway/ActivityDatabaseGateway';

export class CreateActivityInteractor implements UseCaseActivator {
  private activityDb: ActivityDatabaseGateway;

  constructor(userDb: ActivityDatabaseGateway) {
    this.activityDb = userDb;
  }

  public async execute(request: CreateActivityRequest) {
    const { name } = request as CreateActivityRequest;
    const activity = new Activity({ name });

    return this.trySaveActivity(activity);
  }

  private async trySaveActivity(activity: Activity): Promise<Activity> {
    return this.activityDb.createActivity(activity);
  }
}
