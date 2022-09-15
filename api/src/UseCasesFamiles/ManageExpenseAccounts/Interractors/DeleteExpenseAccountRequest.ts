'use strict';

import Joi = require('joi');
import { UseCaseRequest } from '../../../delivery/Requestors/UseCaseRequest';

export class DeleteExpenseAccountRequest extends UseCaseRequest {
  public id: number;

  constructor(params: { id: number }) {
    super();
    this.id = params.id;
  }

  public static async checkBuildParamsAreValid(buildParams: any) {
    const schema = Joi.object({
      id: Joi.number().required(),
    });

    return schema.validateAsync(buildParams);
  }
}