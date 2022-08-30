"use strict";

import { Controller } from "../../_utils/Controller";

export class RefreshTokenController extends Controller {
  constructor(opts: { url: string }) {
    super({
      strategy: Controller.STRATEGIES.GET,
      url: opts.url,
      useCaseName: "RefreshToken",
      ...opts,
    });
  }
}
