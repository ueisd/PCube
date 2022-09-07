'use strict';

import Joi = require('joi');
import { UseCaseRequest } from '../../../system/Requestors/UseCaseRequest';

export class CreateTimelinesRequest extends UseCaseRequest {
  public timelines: { ActivityId: number; ExpenseAccountId: number; ProjectId: number; UserId: number; punchIn: number; punchOut: number }[];

  constructor(params: { ActivityId: number; ExpenseAccountId: number; ProjectId: number; UserId: number; punchIn: number; punchOut: number }[]) {
    super();
    this.timelines = params;
  }

  public static async checkBuildParamsAreValid(buildParams: any) {
    const schema = Joi.array().items(
      Joi.object({
        ActivityId: Joi.number().positive(),
        ExpenseAccountId: Joi.number().positive(),
        ProjectId: Joi.number().positive(),
        UserId: Joi.number().positive(),
        punchIn: Joi.number().positive(),
        punchOut: Joi.number().positive(),
      })
    );

    return await schema.validateAsync(buildParams);
  }
}
