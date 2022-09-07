"use strict";

import { UseCaseActivator } from "./UseCaseActivator";
import _ = require("lodash");

export class InteractorFactory {
  private register: { name: string; activator: UseCaseActivator }[];
  constructor(registerVals: { name: string; activator: UseCaseActivator }[]) {
    this.register = registerVals;
  }
  public make(name) {
    const activatorEntry = _.find(this.register, (elem) => elem.name === name);
    return _.get(activatorEntry, "activator", null);
  }
}
