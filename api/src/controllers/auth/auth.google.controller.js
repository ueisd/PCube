const passport = require('passport');
var nconf = require('nconf');
const { jwtSignId } = require('./utils/jwt.utils');

const timeRefresh = '1200s';


exports.googleAuth = (req, res, next) => {
  passport.authenticate('google', { session: false, scope: ['email'] })(req, res, next);
}
  
exports.googleAuthCb = (req, res, next) => {
  passport.authenticate('google', { session: false })(req, res, next);
}

exports.generateOAuth2UserToken = (req, res, next) => {
  let user = req.user;
  let response = {
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