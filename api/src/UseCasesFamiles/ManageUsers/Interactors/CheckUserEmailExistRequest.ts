'use strict';

import Joi = require('joi');
import { UseCaseRequest } from '../../../system/Requestors/UseCaseRequest';

export class CheckUserEmailExistRequest extends UseCaseRequest {
  public email: string;

  constructor(params: { email: string }) {
    super();
    this.email = params.email;
  }

  public static async checkBuildParamsAreValid(buildParams: any) {
    const schema = Joi.object({
      email: Joi.string().trim().max(100).required(),
    });

    return schema.validateAsync(buildParams);
  }
}
