"use strict";

import { SignInRequest } from "../UseCasesFamiles/Signin/Interactors/SignInRequest";
import { UseCaseRequest } from "./UseCaseRequest";

export class RequestFactory {
  public async make(name: string, params: any): Promise<UseCaseRequest> {
    if (name === "SignIn") {
      await SignInRequest.checkBuildParamsAreValid(params.body);
      return new SignInRequest(params.body);
    }

    return null;
  }
}
