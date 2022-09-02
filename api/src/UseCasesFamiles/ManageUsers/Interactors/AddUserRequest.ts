'use strict';

import Joi = require('joi');
import { UseCaseRequest } from '../../../Requestors/UseCaseRequest';

export class AddUserRequest extends UseCaseRequest {
  public email: string;
  public password: string;
  public firstName: string;
  public lastName: string;
  public RoleId: string;

  constructor(params: { email: string; password: string; firstName: string; lastName: string; RoleId?: string }) {
    super();
    this.email = params.email;
    this.password = params.password;
    this.firstName = params.firstName;
    this.lastName = params.lastName;
    this.RoleId = params.RoleId;
  }

  public static async checkBuildParamsAreValid(buildParams: any) {
    const schema = Joi.object({
      email: Joi.string().max(100).email().required(),
      password: Joi.string().max(20).required(),
      firstName: Joi.string().max(40).required(),
      lastName: Joi.string().max(40).required(),
      RoleId: Joi.number(),
    });

    await schema.validateAsync(buildParams);
  }
}
