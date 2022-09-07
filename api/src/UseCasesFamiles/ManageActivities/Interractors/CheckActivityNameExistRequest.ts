'use strict';

import Joi = require('joi');
import { UseCaseRequest } from '../../../system/Requestors/UseCaseRequest';

export class CheckActivityNameExistRequest extends UseCaseRequest {
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
