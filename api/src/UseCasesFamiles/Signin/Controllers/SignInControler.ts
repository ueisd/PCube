"use strict";

import { Controller } from "../../_utils/Controller";
import { RequestFactory } from "../../../Requestors/RequestFactory";
import { InteractorFactory } from "../../../Requestors/InteractorFactory";

export class SignInController extends Controller {
  constructor(opts: {
    requestFactory: RequestFactory;
    interactorFactory: InteractorFactory;
  }) {
    super({
      strategy: Controller.STRATEGIES.SEND,
      url: "/api/auth/signin",
      useCaseName: "SignIn",
      ...opts,
    });
  }
}
