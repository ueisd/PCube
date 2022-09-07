'use strict';

import Joi = require('joi');
import { UseCaseRequest } from '../../../delivery/Requestors/UseCaseRequest';

export class CreateProjectRequest extends UseCaseRequest {
  public name: string;
  public ProjectId?: number;

  constructor(params: { name: string; ProjectId?: number }) {
    super();
    this.name = params.name;
    this.ProjectId = params.ProjectId;
  }

  public static async checkBuildParamsAreValid(buildParams: any) {
    const schema = Joi.object({
      name: Joi.string().min(5).max(40).trim().required(),
      ProjectId: Joi.number().allow(null),
    });

    return await schema.validateAsync(buildParams);
  }
}
