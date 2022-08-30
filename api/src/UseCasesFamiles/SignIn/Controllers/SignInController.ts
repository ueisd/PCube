"use strict";

import { Controller } from "../../_utils/Controller";

export class SignInController extends Controller {
  constructor(opts: { url: string }) {
    super({
      strategy: Controller.STRATEGIES.SEND,
      url: opts.url,
      useCaseName: "SignIn",
      ...opts,
    });
  }
}
