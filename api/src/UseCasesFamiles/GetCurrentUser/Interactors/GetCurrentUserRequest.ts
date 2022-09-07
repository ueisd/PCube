'use strict';

import { UseCaseRequest } from '../../../system/Requestors/UseCaseRequest';
import Joi = require('joi');

export class GetCurrentUserRequest extends UseCaseRequest {
  public id: string;

  constructor(params: { id: string }) {
    super();
    this.id = params.id;
  }

  public static async checkBuildParamsAreValid(buildParams: any) {
    const schema = Joi.object({
      id: Joi.string().max(20).required(),
    });

    await schema.validateAsync(buildParams);
  }
}
