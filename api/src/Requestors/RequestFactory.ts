"use strict";

import { UseCaseRequest } from "./UseCaseRequest";
import _ = require("lodash");

export class RequestFactory {
  private registerVals: {
    name: string;
    requestFactory: (req) => Promise<UseCaseRequest>;
  }[];

  constructor(
    registerVals: {
      name: string;
      requestFactory: (req) => Promise<UseCaseRequest>;
    }[]
  ) {
    this.registerVals = registerVals;
  }

  public async make(name: string, params: any): Promise<UseCaseRequest> {
    const builderEntry = _.find(
      this.registerVals,
      (elem) => elem.name === name
    );
    const requestFactory = _.get(builderEntry, "requestFactory", null);
    return requestFactory(params);
  }
}
