'use strict';

import { UseCaseActivator } from '../../../delivery/Requestors/UseCaseActivator';
import UserDatabaseGateway from '../../../EntitiesFamilies/User/databaseGateway/UserDatabaseGateway';
import User from '../../../EntitiesFamilies/User/entities/User';
import { NotFoundError } from '../../../delivery/Requestors/Errors/NotFoundError';

export class ListUsersInteractor implements UseCaseActivator {
  private userDb: UserDatabaseGateway;

  constructor(userDb: UserDatabaseGateway) {
    this.userDb = userDb;
  }

  public async execute() {
    return this.tryListUsers();
  }

  private async tryListUsers(): Promise<User[]> {
    const users: User[] = await this.userDb.findAllUsersEager();
    if (!users) {
      throw new NotFoundError("Pas d'utilisateurs!");
    }

    return users;
  }
}
