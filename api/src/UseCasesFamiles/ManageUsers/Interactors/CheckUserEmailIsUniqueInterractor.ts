'use strict';

import { UseCaseActivator } from '../../../system/Requestors/UseCaseActivator';
import UserDatabaseGateway from '../../../entitiesFamilies/User/databaseGateway/UserDatabaseGateway';
import { CheckUserEmailExistRequest } from './CheckUserEmailExistRequest';
import { UseCaseRequest } from '../../../system/Requestors/UseCaseRequest';

export class CheckUserEmailExistInteractor implements UseCaseActivator {
  private userDb: UserDatabaseGateway;

  constructor(userDb: UserDatabaseGateway) {
    this.userDb = userDb;
  }

  public async execute(request: UseCaseRequest): Promise<Boolean> {
    const { email } = request as CheckUserEmailExistRequest;

    return this.isUserEmailExist(email);
  }

  private async isUserEmailExist(email) {
    const res = await this.userDb.findUserByEmail(email);

    if (!res) {
      return false;
    }

    return true;
  }
}
