'use strict';

import Joi = require('joi');
import { UseCaseRequest } from '../../../Requestors/UseCaseRequest';

export class UpdateUserRequest extends UseCaseRequest {
  public id: number;
  public email: string;
  public firstName: string;
  public lastName: string;
  public RoleId: string;

  constructor(params: { id: number; email: string; firstName: string; lastName: string; RoleId?: string }) {
    super();
    this.id = params.id;
    this.email = params.email;
    this.firstName = params.firstName;
    this.lastName = params.lastName;
    this.RoleId = params.RoleId;
  }

  public static async checkBuildParamsAreValid(buildParams: any) {
    const schema = Joi.object({
      id: Joi.number().required(),
      email: Joi.string().max(100).email().required(),
      firstName: Joi.string().max(40).required(),
      lastName: Joi.string().max(40).required(),
      RoleId: Joi.number(),
    });

    await schema.validateAsync(buildParams);
  }
}
