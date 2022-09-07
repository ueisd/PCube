'use strict';

import { UseCaseActivator } from '../../../system/Requestors/UseCaseActivator';
import UserDatabaseGateway from '../../../entitiesFamilies/User/databaseGateway/UserDatabaseGateway';
import User from '../../../entitiesFamilies/User/entities/User';
import { UseCaseRequest } from '../../../system/Requestors/UseCaseRequest';
import { GetCurrentUserRequest } from './GetCurrentUserRequest';
import { GetCurrentUserResponse } from './GetCurrentUserResponse';

export class GetCurrentUserInteractor implements UseCaseActivator {
  private userDb: UserDatabaseGateway;

  constructor(userDb: UserDatabaseGateway) {
    this.userDb = userDb;
  }

  public async execute(request: UseCaseRequest) {
    const { id } = this.tryExtractParams(request as GetCurrentUserRequest);

    const user = await this.tryFindUserById(id);

    return new GetCurrentUserResponse({
      user,
    });
  }

  private tryExtractParams(getCurrentUserRequest): GetCurrentUserRequest {
    const id = getCurrentUserRequest.id;

    if (!id) {
      throw new Error('signin fail !');
    }

    return { id };
  }

  private async tryFindUserById(id): Promise<User> {
    const user: User = await this.userDb.findUserById(id);
    if (!user) {
      throw new Error("Pas d'utilisateur");
    }

    return user;
  }
}
