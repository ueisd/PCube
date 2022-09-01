'use strict';

import { Controller } from '../../_utils/Controller';
const passport = require('passport');

export class GoogleSignInController extends Controller {
  constructor(opts: { url: string }) {
    super({
      strategy: Controller.STRATEGIES.GET,
      url: opts.url,
      beforeCommandMiddlewares: [
        passport.authenticate('google', {
          session: false,
          scope: ['email', 'profile'],
        }),
      ],
    });
  }
}
