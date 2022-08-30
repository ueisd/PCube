"use strict";

import { UseCaseRequest } from "../../../Requestors/UseCaseRequest";
import Joi = require("joi");

export class RefreshTokenRequest extends UseCaseRequest {
  public token: string;

  constructor(params: { token: string }) {
    super();
    this.token = params.token;
  }

  public static async checkBuildParamsAreValid(buildParams: any) {
    const schema = Joi.object({
      token: Joi.string().max(500).required(),
    });

    await schema.validateAsync(buildParams);
  }
}
