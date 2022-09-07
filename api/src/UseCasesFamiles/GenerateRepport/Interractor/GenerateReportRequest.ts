'use strict';

import Joi = require('joi');
import { UseCaseRequest } from '../../../Requestors/UseCaseRequest';

export class GenerateReportRequest extends UseCaseRequest {
  public activitys: number[];
  public projects: number[];
  public users: number[];
  public debut: number;
  public fin: number;

  constructor(params: { activitys: number[]; projects: number[]; users: number[]; debut: number; fin: number }) {
    super();
    this.activitys = params.activitys;
    this.projects = params.projects;
    this.users = params.users;
    this.debut = params.debut;
    this.fin = params.fin;
  }

  public static async checkBuildParamsAreValid(buildParams: any) {
    const schema = Joi.object({
      activitys: Joi.array().items(Joi.object({ id: Joi.number().required() }).unknown()),
      projects: Joi.array().items(Joi.object({ id: Joi.number().required() }).unknown()),
      users: Joi.array().items(Joi.object({ id: Joi.number().required() }).unknown()),
      debut: Joi.string().allow(''),
      fin: Joi.string().allow(''),
    });

    return await schema.validateAsync(buildParams);
  }
}
