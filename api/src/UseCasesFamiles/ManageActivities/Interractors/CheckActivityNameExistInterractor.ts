'use strict';

import { UseCaseActivator } from '../../../Requestors/UseCaseActivator';
import { CheckActivityNameExistRequest } from './CheckActivityNameExistRequest';
import ActivityDatabaseGateway from '../../../entitiesFamilies/Activity/databaseGateway/ActivityDatabaseGateway';

export class CheckActivityNameExistInterractor implements UseCaseActivator {
  private activityDb: ActivityDatabaseGateway;

  constructor(activityDb: ActivityDatabaseGateway) {
    this.activityDb = activityDb;
  }

  public async execute(request: CheckActivityNameExistRequest): Promise<Boolean> {
    const { name } = request as CheckActivityNameExistRequest;

    return await this.isActivityNameExist(name);
  }

  private async isActivityNameExist(name) {
    return this.activityDb.isActivityNameExist(name);
  }
}
