'use strict';

import { UseCaseActivator } from '../../../delivery/Requestors/UseCaseActivator';
import UserDatabaseGateway from '../../../EntitiesFamilies/User/databaseGateway/UserDatabaseGateway';

export class ListRolesInteractor implements UseCaseActivator {
  private rolesDb: UserDatabaseGateway;

  constructor(userDb: UserDatabaseGateway) {
    this.rolesDb = userDb;
  }

  public async execute() {
    return this.rolesDb.findAllRoles();
  }
}
