'use strict';

import { Controller } from '../../_utils/Controller';
import { jwtSignId } from '../_utils/jwt.utils';
const passport = require('passport');
const nconf = require('nconf');

export class GoogleCbSignInController extends Controller {
  constructor(opts: { url: string }) {
    super({
      strategy: Controller.STRATEGIES.GET,
      url: opts.url,
      beforeCommandMiddlewares: [passport.authenticate('google', { session: false }), generateOAuth2UserToken],
    });
  }
}

export function generateOAuth2UserToken(req, res) {
  let timeRefresh = nconf.get('jwt_refresh_token_expires');
  let user = req.user;

  let response: any = { user };

  let rsaPrivateKey = nconf.get('rsaKeyPrivate');
  response.token = jwtSignId(user.id, rsaPrivateKey, timeRefresh);

  var responseHTML = '<html><head><title>Main</title></head><body></body><script>res = %value%; window.opener.postMessage(res, "*");window.close();</script></html>';
  responseHTML = responseHTML.replace(
    '%value%',
    JSON.stringify({
      oauth2CallbackToken: response.token,
      error: null,
    })
  );
  res.status(200).send(responseHTML);
}
