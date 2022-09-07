"use strict";

import User from "../../../EntitiesFamilies/User/entities/User";
import _ = require("lodash");

export class SignInResponse {
  public user: User;
  public token: string;

  constructor(params: { user: User; token: string }) {
    this.user = _.omit(params.user, "password");
    this.token = params.token;
  }
}
