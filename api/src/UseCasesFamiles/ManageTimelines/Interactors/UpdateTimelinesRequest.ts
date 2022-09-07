'use strict';

import Joi = require('joi');
import { UseCaseRequest } from '../../../delivery/Requestors/UseCaseRequest';

export class UpdateTimelinesRequest extends UseCaseRequest {
  public timelines: { id: number; ActivityId: number; ExpenseAccountId: number; ProjectId: number; UserId: number; punchIn: number; punchOut: number }[];

  constructor(params: { id: number; ActivityId: number; ExpenseAccountId: number; ProjectId: number; UserId: number; punchIn: number; punchOut: number }[]) {
    super();
    this.timelines = params;
  }

  public static async checkBuildParamsAreValid(buildParams: any) {
    const schema = Joi.array().items(
      Joi.object({
        id: Joi.number().positive(),
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
