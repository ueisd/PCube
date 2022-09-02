'use strict';

import Joi = require('joi');
import { UseCaseRequest } from '../../../Requestors/UseCaseRequest';

export class CheckUserEmailExistRequest extends UseCaseRequest {
  public email: string;

  constructor(params: { email: string }) {
    super();
    this.email = params.email;
  }

  public static async checkBuildParamsAreValid(buildParams: any) {
    const schema = Joi.object({
      email: Joi.string().max(100).required(),
    });

    await schema.validateAsync(buildParams);
  }
}
