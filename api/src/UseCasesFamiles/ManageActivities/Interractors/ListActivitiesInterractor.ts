'use strict';

import { UseCaseActivator } from '../../../delivery/Requestors/UseCaseActivator';
import { NotFoundError } from '../../../delivery/Requestors/Errors/NotFoundError';
import ActivityDatabaseGateway from '../../../EntitiesFamilies/Activity/databaseGateway/ActivityDatabaseGateway';
import Activity from '../../../EntitiesFamilies/Activity/entities/Activity';

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
      throw new NotFoundError("Pas d'activités!");
    }

    return activities;
  }
}
