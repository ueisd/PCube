"use strict";

import { UseCaseRequest } from "./UseCaseRequest";

export interface UseCaseActivator {
  execute(params: UseCaseRequest);
}
