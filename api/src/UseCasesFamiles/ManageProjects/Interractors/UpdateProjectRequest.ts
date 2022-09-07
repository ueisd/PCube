'use strict';

import Joi = require('joi');
import { UseCaseRequest } from '../../../delivery/Requestors/UseCaseRequest';

export class UpdateProjectRequest extends UseCaseRequest {
  public id: number;
  public name: string;
  public ProjectId?: number | null;

  constructor(params: { id: number; name: string; ProjectId?: number }) {
    super();
    this.id = params.id;
    this.name = params.name;
    this.ProjectId = params.ProjectId;
  }

  public static async checkBuildParamsAreValid(buildParams: any) {
    const schema = Joi.object({
      id: Joi.number().required(),
      name: Joi.string().min(5).max(40).trim().required(),
      ProjectId: Joi.number().allow(null),
    });

    return await schema.validateAsync(buildParams);
  }
}
