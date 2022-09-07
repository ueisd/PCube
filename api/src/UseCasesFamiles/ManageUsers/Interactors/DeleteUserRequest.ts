'use strict';

import Joi = require('joi');
import { UseCaseRequest } from '../../../system/Requestors/UseCaseRequest';

export class DeleteUserRequest extends UseCaseRequest {
  public id: number;

  constructor(params: { id: number }) {
    super();
    this.id = params.id;
  }

  public static async checkBuildParamsAreValid(buildParams: any) {
    const schema = Joi.object({
      id: Joi.number().required(),
    });

    await schema.validateAsync(buildParams);
  }
}
