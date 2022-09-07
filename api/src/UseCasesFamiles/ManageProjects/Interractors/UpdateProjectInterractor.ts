'use strict';

import { UseCaseActivator } from '../../../delivery/Requestors/UseCaseActivator';
import ProjectDatabaseGateway from '../../../EntitiesFamilies/Project/databaseGateway/ProjectDatabaseGateway';
import { UseCaseRequest } from '../../../delivery/Requestors/UseCaseRequest';
import { UpdateProjectRequest } from './UpdateProjectRequest';

export class UpdateProjectInteractor implements UseCaseActivator {
  private projectDb: ProjectDatabaseGateway;

  constructor(projectDb: ProjectDatabaseGateway) {
    this.projectDb = projectDb;
  }

  public async execute(request: UseCaseRequest) {
    const { id, ...props } = request as UpdateProjectRequest;

    // if (!props.ProjectId) {
    //   props.ProjectId = null;
    // }

    const res = await this.projectDb.updateProject(id, props);

    checkUpdateHasAffectedRows(res);

    // TODO gerer erreure
    return this.projectDb.findProjectById(id);
  }
}

function checkUpdateHasAffectedRows(res) {
  if (res[0] === 0) {
    throw new Error("Le projet n'a pas été updaté");
  }
}
