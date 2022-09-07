'use strict';

import { UseCaseActivator } from '../../../system/Requestors/UseCaseActivator';
import UserDatabaseGateway from '../../../entitiesFamilies/User/databaseGateway/UserDatabaseGateway';

export class ListRolesInteractor implements UseCaseActivator {
  private rolesDb: UserDatabaseGateway;

  constructor(userDb: UserDatabaseGateway) {
    this.rolesDb = userDb;
  }

  public async execute() {
    return this.rolesDb.findAllRoles();
  }
}
