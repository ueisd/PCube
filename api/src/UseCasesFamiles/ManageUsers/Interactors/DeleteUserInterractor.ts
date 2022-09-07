'use strict';

import { UseCaseActivator } from '../../../system/Requestors/UseCaseActivator';
import UserDatabaseGateway from '../../../entitiesFamilies/User/databaseGateway/UserDatabaseGateway';
import User from '../../../entitiesFamilies/User/entities/User';
import { DeleteUserRequest } from './DeleteUserRequest';

export class DeleteUserInteractor implements UseCaseActivator {
  private userDb: UserDatabaseGateway;

  constructor(userDb: UserDatabaseGateway) {
    this.userDb = userDb;
  }

  public async execute(request: DeleteUserRequest): Promise<User> {
    const { id } = request as DeleteUserRequest;

    const res = await this.userDb.deleteUser(id);

    checkDeleteHasAffectedRows(res, id);

    return this.userDb.findUserById(id);
  }
}

function checkDeleteHasAffectedRows(res, id) {
  if (res !== 1) {
    throw new Error(`La base de donnée ne peut supprimer l'utilisateur avec l'id ${id}.`);
  }
}
