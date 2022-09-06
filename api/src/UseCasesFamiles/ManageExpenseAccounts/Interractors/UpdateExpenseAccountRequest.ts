'use strict';

import Joi = require('joi');
import { UseCaseRequest } from '../../../Requestors/UseCaseRequest';

export class UpdateExpenseAccountRequest extends UseCaseRequest {
  public id: number;
  public name: string;
  public ExpenseAccountId?: number | null;

  constructor(params: { id: number; name: string; ExpenseAccountId?: number }) {
    super();
    this.id = params.id;
    this.name = params.name;
    this.ExpenseAccountId = params.ExpenseAccountId;
  }

  public static async checkBuildParamsAreValid(buildParams: any) {
    const schema = Joi.object({
      id: Joi.number().required(),
      name: Joi.string().min(5).max(40).trim().required(),
      ExpenseAccountId: Joi.number().allow(null),
    });

    return await schema.validateAsync(buildParams);
  }
}
