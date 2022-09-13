'use strict';

import { RefreshTokenResponse } from './RefreshTokenResponse';

import { actualConfig } from '../../../configuration';
import { jwtSignId } from '../_utils/jwt.utils';

import { UseCaseActivator } from '../../../delivery/Requestors/UseCaseActivator';
import UserDatabaseGateway from '../../../EntitiesFamilies/User/databaseGateway/UserDatabaseGateway';
import { UseCaseRequest } from '../../../delivery/Requestors/UseCaseRequest';
import { RefreshTokenRequest } from './RefreshTokenRequest';
import { JwtHelper } from '../_utils/JwtHelper';

export class RefreshTokenInteractor implements UseCaseActivator {
  private userDb: UserDatabaseGateway;

  constructor(userDb: UserDatabaseGateway) {
    this.userDb = userDb;
  }

  public async execute(request: UseCaseRequest) {
    const { token } = this.tryExtractParams(request as RefreshTokenRequest);

    let rsaPrivateKey = actualConfig.rsaKeyPrivate;
    let rsaPublicKey = actualConfig.rsaKeyPublic;
    let timeRefresh = actualConfig.jwt_refresh_token_expires;

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
