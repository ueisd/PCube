'use strict';

import { UseCaseActivator } from '../../../delivery/Requestors/UseCaseActivator';
import ProjectDatabaseGateway from '../../../EntitiesFamilies/Project/databaseGateway/ProjectDatabaseGateway';
import { CreateProjectRequest } from './CreateProjectRequest';
import { UseCaseRequest } from '../../../delivery/Requestors/UseCaseRequest';

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
