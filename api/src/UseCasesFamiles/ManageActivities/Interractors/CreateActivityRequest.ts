'use strict';

import Joi = require('joi');
import { UseCaseRequest } from '../../../delivery/Requestors/UseCaseRequest';

export class CreateActivityRequest extends UseCaseRequest {
  public name: string;

  constructor(params: { name: string }) {
    super();
    this.name = params.name;
  }

  public static async checkBuildParamsAreValid(buildParams: any) {
    const schema = Joi.object({
      name: Joi.string().min(5).max(40).trim().required(),
    });

    return await schema.validateAsync(buildParams);
  }
}
