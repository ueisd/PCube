'use strict';

import Joi = require('joi');
import { UseCaseRequest } from '../../../delivery/Requestors/UseCaseRequest';

export class CheckExpenseAccountNameExistRequest extends UseCaseRequest {
  public name: string;

  constructor(params: { name: string }) {
    super();
    this.name = params.name;
  }

  public static async checkBuildParamsAreValid(buildParams: any) {
    const schema = Joi.object({
      name: Joi.string().trim().max(100).required(),
    });

    return schema.validateAsync(buildParams);
  }
}