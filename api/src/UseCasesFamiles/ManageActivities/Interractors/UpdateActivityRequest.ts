'use strict';

import Joi = require('joi');
import { UseCaseRequest } from '../../../delivery/Requestors/UseCaseRequest';

export class UpdateActivityRequest extends UseCaseRequest {
  public id: number;
  public name: string;

  constructor(params: { id: number; name: string }) {
    super();
    this.id = params.id;
    this.name = params.name;
  }

  public static async checkBuildParamsAreValid(buildParams: any) {
    const schema = Joi.object({
      id: Joi.number().required(),
      name: Joi.string().min(5).max(40).trim().required(),
    });

    return schema.validateAsync(buildParams);
  }
}
