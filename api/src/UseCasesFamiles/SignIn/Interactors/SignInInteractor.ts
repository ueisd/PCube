'use strict';

import bcrypt = require('bcrypt');
const nconf = require('nconf');
import { jwtSignId } from '../_utils/jwt.utils';

import { UseCaseActivator } from '../../../delivery/Requestors/UseCaseActivator';
import UserDatabaseGateway from '../../../EntitiesFamilies/User/databaseGateway/UserDatabaseGateway';
import User from '../../../EntitiesFamilies/User/entities/User';
import { UseCaseRequest } from '../../../delivery/Requestors/UseCaseRequest';
import { SignInRequest } from './SignInRequest';
import { SignInResponse } from './SignInResponse';

export class SignInInteractor implements UseCaseActivator {
  private userDb;

  constructor(userDb: UserDatabaseGateway) {
    this.userDb = userDb;
  }

  public async execute(request: UseCaseRequest) {
    const { email, password } = this.tryExtractParams(request as SignInRequest);

    const user = await this.tryFindUserByEmail(email);

    this.checkThatUserOwnPassword(user, password);

    return new SignInResponse({
      user,
      token: this.signInUser(user),
    });
  }

  private tryExtractParams(signInRequest): SignInRequest {
    const email = signInRequest.email;
    const password = signInRequest.password;

    if (!email || !password) {
      throw new Error('signin fail !');
    }

    return { email, password };
  }

  private async tryFindUserByEmail(email): Promise<User> {
    const user: User = await this.userDb.findUserByEmail(email);
    if (!user) {
      throw new Error('signin fail !');
    }

    return user;
  }

  private checkThatUserOwnPassword(user, password) {
    if (!bcrypt.compareSync(password, user.password)) {
      throw new Error('signin fail !');
    }
  }

  private signInUser(user) {
    let rsa_key_private = nconf.get('rsaKeyPrivate');
    let timeRefresh = nconf.get('jwt_refresh_token_expires');
    console.log(JSON.stringify({ rsa_key_private, timeRefresh }, null, 2));

    return jwtSignId(user.id, rsa_key_private, timeRefresh);
  }
}
