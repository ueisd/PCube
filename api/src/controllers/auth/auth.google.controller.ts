// const passport = require('passport');
var nconf = require('nconf');
const { jwtSignId } = require('./utils/jwt.utils');


exports.googleAuth = (req, res, next) => {
  passport.authenticate('google', { session: false, scope: ['email', 'profile'] })(req, res, next);
}
  
exports.googleAuthCb = (req, res, next) => {
  passport.authenticate('google', { session: false })(req, res, next);
}

exports.generateOAuth2UserToken = (req, res, next) => {
  let timeRefresh = nconf.get('jwt_refresh_token_expires');
  let user = req.user;
  let response:any = {
    user: user
  };
  let rsaPrivateKey = nconf.get('rsaKeyPrivate')
  response.token = jwtSignId(user.id, rsaPrivateKey, timeRefresh);

  var responseHTML = '<html><head><title>Main</title></head><body></body><script>res = %value%; window.opener.postMessage(res, "*");window.close();</script></html>'
    responseHTML = responseHTML.replace('%value%', JSON.stringify({
        oauth2CallbackToken: response.token,
        error: null
    }));
    res.status(200).send(responseHTML);
}