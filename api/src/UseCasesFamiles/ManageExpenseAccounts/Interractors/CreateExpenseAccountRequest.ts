'use strict';

import Joi = require('joi');
import { UseCaseRequest } from '../../../delivery/Requestors/UseCaseRequest';

export class CreateExpenseAccountRequest extends UseCaseRequest {
  public name: string;
  public ExpenseAccountId?: number;

  constructor(params: { name: string; ExpenseAccountId?: number }) {
    super();
    this.name = params.name;
    this.ExpenseAccountId = params.ExpenseAccountId;
  }

  public static async checkBuildParamsAreValid(buildParams: any) {
    const schema = Joi.object({
      name: Joi.string().min(5).max(40).trim().required(),
      ExpenseAccountId: Joi.number().allow(null),
    });

    return await schema.validateAsync(buildParams);
  }
}
