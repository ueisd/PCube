'use strict';

import Joi = require('joi');
import { UseCaseRequest } from '../../../delivery/Requestors/UseCaseRequest';

export class DeleteTimelinesRequest extends UseCaseRequest {
  public timelineIds: number[];

  constructor(params: number[]) {
    super();
    this.timelineIds = params;
  }

  public static async checkBuildParamsAreValid(buildParams: any) {
    const schema = Joi.array().items(Joi.number().positive());

    return await schema.validateAsync(buildParams);
  }
}
