'use strict';

import { UseCaseActivator } from '../../../delivery/Requestors/UseCaseActivator';
import ProjectDatabaseGateway from '../../../EntitiesFamilies/Project/databaseGateway/ProjectDatabaseGateway';
import { CheckProjectNameExistRequest } from './CheckProjectNameExistRequest';
import { UseCaseRequest } from '../../../delivery/Requestors/UseCaseRequest';

export class CheckProjectNameExistInterractor implements UseCaseActivator {
  private projectDb: ProjectDatabaseGateway;

  constructor(projectDb: ProjectDatabaseGateway) {
    this.projectDb = projectDb;
  }

  public async execute(request: UseCaseRequest): Promise<Boolean> {
    const { name } = request as CheckProjectNameExistRequest;

    return await this.isProjectNameExist(name);
  }

  private async isProjectNameExist(name) {
    return this.projectDb.isProjectNameExist(name);
  }
}
