'use strict';

import { UseCaseActivator } from '../../../system/Requestors/UseCaseActivator';
import { NotFoundError } from '../../../system/Requestors/Errors/NotFoundError';
import ActivityDatabaseGateway from '../../../entitiesFamilies/Activity/databaseGateway/ActivityDatabaseGateway';
import Activity from '../../../entitiesFamilies/Activity/entities/Activity';
import ProjectDatabaseGateway from '../../../entitiesFamilies/Project/databaseGateway/ProjectDatabaseGateway';
import Project from '../../../entitiesFamilies/Project/entities/Project';

export class ListProjectsInteractor implements UseCaseActivator {
  private projectDb: ProjectDatabaseGateway;

  constructor(projectDb: ProjectDatabaseGateway) {
    this.projectDb = projectDb;
  }

  public async execute() {
    return this.tryListUsers();
  }

  private async tryListUsers(): Promise<Project[]> {
    const projects: Project[] = await this.projectDb.listAll();

    if (!projects) {
      throw new NotFoundError('Pas de projets!');
    }

    return projects;
  }
}
