'use strict';

import { UseCaseActivator } from '../../../Requestors/UseCaseActivator';
import { NotFoundError } from '../../../Requestors/Errors/NotFoundError';
import ActivityDatabaseGateway from '../../../entitiesFamilies/Activity/databaseGateway/ActivityDatabaseGateway';
import Activity from '../../../entitiesFamilies/Activity/entities/Activity';

export class ListActivitiesInteractor implements UseCaseActivator {
  private activityDb: ActivityDatabaseGateway;

  constructor(activityDb: ActivityDatabaseGateway) {
    this.activityDb = activityDb;
  }

  public async execute() {
    return this.tryListUsers();
  }

  private async tryListUsers(): Promise<Activity[]> {
    const activities: Activity[] = await this.activityDb.listAll();

    if (!activities) {
      throw new NotFoundError("Pas d'utilisateurs!");
    }

    return activities;
  }
}
