'use strict';

import { UseCaseActivator } from '../../../system/Requestors/UseCaseActivator';
import UserDatabaseGateway from '../../../entitiesFamilies/User/databaseGateway/UserDatabaseGateway';
import User from '../../../entitiesFamilies/User/entities/User';
import { AddUserRequest } from './AddUserRequest';

export class AddUserInteractor implements UseCaseActivator {
  private userDb: UserDatabaseGateway;

  constructor(userDb: UserDatabaseGateway) {
    this.userDb = userDb;
  }

  public async execute(request: AddUserRequest) {
    const { RoleId, ...userProps } = { ...(request as AddUserRequest) };
    const user = new User({ ...userProps, role: { id: RoleId } });

    return this.trySaveUser(user);
  }

  private async trySaveUser(user: User): Promise<User> {
    return this.userDb.createUser(user);
  }
}
