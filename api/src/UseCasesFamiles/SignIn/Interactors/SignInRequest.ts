'use strict';

import { UseCaseRequest } from '../../../delivery/Requestors/UseCaseRequest';
import Joi = require('joi');

export class SignInRequest extends UseCaseRequest {
  public email: string;
  public password: string;

  constructor(params: { email: string; password: string }) {
    super();
    this.email = params.email;
    this.password = params.password;
  }

  public static async checkBuildParamsAreValid(buildParams: any) {
    const schema = Joi.object({
      email: Joi.string().max(3).required(),
      password: Joi.string().max(3).required(),
    });

    await schema.validateAsync(buildParams);
  }
}
