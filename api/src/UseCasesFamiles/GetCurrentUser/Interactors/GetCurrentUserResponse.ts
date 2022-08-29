"use strict";

import User from "../../../entitiesFamilies/User/entities/User";
import _ = require("lodash");

export class GetCurrentUserResponse {
  public user: User;

  constructor(params: { user: User }) {
    this.user = _.omit(params.user, "password");
  }
}
