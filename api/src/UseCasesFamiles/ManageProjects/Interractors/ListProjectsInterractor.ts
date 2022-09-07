'use strict';

import { UseCaseActivator } from '../../../delivery/Requestors/UseCaseActivator';
import { NotFoundError } from '../../../delivery/Requestors/Errors/NotFoundError';
import ActivityDatabaseGateway from '../../../EntitiesFamilies/Activity/databaseGateway/ActivityDatabaseGateway';
import Activity from '../../../EntitiesFamilies/Activity/entities/Activity';
import ProjectDatabaseGateway from '../../../EntitiesFamilies/Project/databaseGateway/ProjectDatabaseGateway';
import Project from '../../../EntitiesFamilies/Project/entities/Project';

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
