'use strict';

import { UseCaseActivator } from '../../../Requestors/UseCaseActivator';
import { DeleteActivityRequest } from './DeleteActivityRequest';
import ActivityDatabaseGateway from '../../../entitiesFamilies/Activity/databaseGateway/ActivityDatabaseGateway';

export class DeleteActivityInterractor implements UseCaseActivator {
  private activityDb: ActivityDatabaseGateway;

  constructor(activityDb: ActivityDatabaseGateway) {
    this.activityDb = activityDb;
  }

  public async execute(request: DeleteActivityRequest): Promise<boolean> {
    const { id } = request as DeleteActivityRequest;

    const res = await this.activityDb.deleteActivityById(id);

    checkDeleteHasAffectedRows(res, id);

    return true;
  }
}

function checkDeleteHasAffectedRows(res, id) {
  if (res !== 1) {
    throw new Error(`La base de donnée ne peut supprimer l'activité avec l'id ${id}.`);
  }
}
