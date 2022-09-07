'use strict';

import { UseCaseActivator } from '../../../system/Requestors/UseCaseActivator';
import UserDatabaseGateway from '../../../entitiesFamilies/User/databaseGateway/UserDatabaseGateway';
import User from '../../../entitiesFamilies/User/entities/User';
import { UpdateUserRequest } from './UpdateUserRequest';

export class UpdateUserInteractor implements UseCaseActivator {
  private userDb: UserDatabaseGateway;

  constructor(userDb: UserDatabaseGateway) {
    this.userDb = userDb;
  }

  public async execute(request: UpdateUserRequest): Promise<User> {
    const { id, ...props } = request as UpdateUserRequest;

    const res = await this.userDb.updateUser(id, props);

    checkUpdateHasAffectedRows(res);

    return this.userDb.findUserById(id);
  }
}

function checkUpdateHasAffectedRows(res) {
  if (res[0] === 0) {
    throw new Error("L'utilisateur n'a pas été updaté");
  }
}
