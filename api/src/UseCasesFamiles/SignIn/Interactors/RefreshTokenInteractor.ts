'use strict';

import { RefreshTokenResponse } from './RefreshTokenResponse';

const nconf = require('nconf');
import { jwtSignId } from '../_utils/jwt.utils';

import { UseCaseActivator } from '../../../Requestors/UseCaseActivator';
import UserDatabaseGateway from '../../../entitiesFamilies/User/databaseGateway/UserDatabaseGateway';
import { UseCaseRequest } from '../../../Requestors/UseCaseRequest';
import { RefreshTokenRequest } from './RefreshTokenRequest';
import { JwtHelper } from '../_utils/JwtHelper';

export class RefreshTokenInteractor implements UseCaseActivator {
  private userDb: UserDatabaseGateway;

  constructor(userDb: UserDatabaseGateway) {
    this.userDb = userDb;
  }

  public async execute(request: UseCaseRequest) {
    const { token } = this.tryExtractParams(request as RefreshTokenRequest);

    let rsaPrivateKey = nconf.get('rsaKeyPrivate');
    let rsaPublicKey = nconf.get('rsaKeyPublic');
    let timeRefresh = nconf.get('jwt_refresh_token_expires');

    const userId = await JwtHelper.tryExtractUserIdFromToken(token, rsaPublicKey);

    const newToken = jwtSignId(userId, rsaPrivateKey, timeRefresh);

    const user = await this.tryGetUserById(userId);

    return new RefreshTokenResponse({
      user,
      token: newToken,
    });
  }

  private async tryGetUserById(userId) {
    const user = await this.userDb.findUserById(userId);

    if (!user) {
      throw new Error("Pas d'utilisateur associe");
    }

    return user;
  }

  private tryExtractParams(signInRequest): RefreshTokenRequest {
    const token = signInRequest.token;

    if (!token) {
      throw new Error('No token to refresh');
    }

    return { token };
  }
}