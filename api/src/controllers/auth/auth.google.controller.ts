const passport = require("passport");
const nconf = require("nconf");
const { jwtSignId } = require("./utils/jwt.utils");

export function googleAuth(req, res, next) {
  passport.authenticate("google", {
    session: false,
    scope: ["email", "profile"],
  })(req, res, next);
}

export function googleAuthCb(req, res, next) {
  passport.authenticate("google", { session: false })(req, res, next);
}

export function generateOAuth2UserToken(req, res) {
  let timeRefresh = nconf.get("jwt_refresh_token_expires");
  let user = req.user;
  let response: any = {
    user: user,
  };
  let rsaPrivateKey = nconf.get("rsaKeyPrivate");
  response.token = jwtSignId(user.id, rsaPrivateKey, timeRefresh);

  var responseHTML =
    '<html><head><title>Main</title></head><body></body><script>res = %value%; window.opener.postMessage(res, "*");window.close();</script></html>';
  responseHTML = responseHTML.replace(
    "%value%",
    JSON.stringify({
      oauth2CallbackToken: response.token,
      error: null,
    })
  );
  res.status(200).send(responseHTML);
}
