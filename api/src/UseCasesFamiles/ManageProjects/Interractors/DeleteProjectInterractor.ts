'use strict';

import { UseCaseActivator } from '../../../system/Requestors/UseCaseActivator';
import ProjectDatabaseGateway from '../../../entitiesFamilies/Project/databaseGateway/ProjectDatabaseGateway';
import { UseCaseRequest } from '../../../system/Requestors/UseCaseRequest';
import { DeleteProjectRequest } from './DeleteProjectRequest';

export class DeleteProjectInterractor implements UseCaseActivator {
  private projectDb: ProjectDatabaseGateway;

  constructor(projectDb: ProjectDatabaseGateway) {
    this.projectDb = projectDb;
  }

  public async execute(request: UseCaseRequest): Promise<boolean> {
    const { id } = request as DeleteProjectRequest;

    const res = await this.projectDb.deleteProjectById(id);

    checkDeleteHasAffectedRows(res, id);

    return true;
  }
}

function checkDeleteHasAffectedRows(res, id) {
  if (res !== 1) {
    throw new Error(`La base de donnée ne peut supprimer le projet avec l'id ${id}.`);
  }
}
