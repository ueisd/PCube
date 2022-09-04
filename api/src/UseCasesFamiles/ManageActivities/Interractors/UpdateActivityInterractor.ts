'use strict';

import { UseCaseActivator } from '../../../Requestors/UseCaseActivator';
import ActivityDatabaseGateway from '../../../entitiesFamilies/Activity/databaseGateway/ActivityDatabaseGateway';
import { UpdateActivityRequest } from './UpdateActivityRequest';
import Activity from '../../../entitiesFamilies/Activity/entities/Activity';

export class UpdateActivityInteractor implements UseCaseActivator {
  private activityDb: ActivityDatabaseGateway;

  constructor(activityDb: ActivityDatabaseGateway) {
    this.activityDb = activityDb;
  }

  public async execute(request: UpdateActivityRequest): Promise<Activity> {
    const { id, name } = request as UpdateActivityRequest;

    const res = await this.activityDb.updateActivity(id, { name });

    checkUpdateHasAffectedRows(res);

    throw new Error("Incapable d'updater lactivité");

    return this.activityDb.findActivityById(id);
  }
}

function checkUpdateHasAffectedRows(res) {
  if (res[0] === 0) {
    throw new Error("L'activité n'a pas été updaté");
  }
}
