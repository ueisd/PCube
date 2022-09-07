'use strict';

import { UseCaseActivator } from '../../../system/Requestors/UseCaseActivator';
import ProjectDatabaseGateway from '../../../entitiesFamilies/Project/databaseGateway/ProjectDatabaseGateway';
import { CreateProjectRequest } from './CreateProjectRequest';
import { UseCaseRequest } from '../../../system/Requestors/UseCaseRequest';

export class CreateProjectInteractor implements UseCaseActivator {
  private projectDb: ProjectDatabaseGateway;

  constructor(projectDb: ProjectDatabaseGateway) {
    this.projectDb = projectDb;
  }

  public async execute(request: UseCaseRequest) {
    const { name, ProjectId } = request as CreateProjectRequest;

    return this.projectDb.createProject({ name, ProjectId });
  }
}
