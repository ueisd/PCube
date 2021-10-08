const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var nconf = require('nconf');


//models
const { User } = require('../../models/user.model');
const timeRefresh = '1200s';

const { jwtSignId } = require('./utils/jwt.utils');

exports.signingLocal = (req, res, next) => {
  if(!req.body.password || !req.body.email) 
    return res.status(401).json('signin fail !');
  User.findUserByEmail(req.body.email)
  .then(result => {
      if( result.length <= 0) {
        res.status(401).json('signin fail !');
      } else {
        let user = result[0];
        if(!user || !bcrypt.compareSync(req.body.password, user.password))
          res.status(401).json('signin fail !');
        else {
          delete user.password;
          delete user.RoleId;
          let response = {
            user: user
          };
          let rsa_key_private = nconf.get('rsaKeyPrivate');
          response.token = jwtSignId(user.id, rsa_key_private, timeRefresh);
          res.status(200).json(response); 
        }
      }
      
  }).catch(error => {
      res.status(401).json('signin fail with error!: ' + error);
  });
}

exports.refreshToken = (req, res, next) => {
    let rsaPrivateKey = nconf.get('rsaKeyPrivate');
    let rsaPublicKey = nconf.get('rsaKeyPublic');

    const token = req.headers.authorization;
    if (token) {
      jwt.verify(token, rsaPublicKey, (err, decoded) => {
        if (err) {
          return res.status(403).json('wrong token');
        }
        const newToken = jwt.sign({}, rsaPrivateKey, {
          algorithm: 'RS256',
          expiresIn: timeRefresh,
          subject: decoded.sub
        })
        User.findUserById(decoded.sub)
        .then(
          user => {
            delete user.password;
            delete user.RoleId;
            res.status(200).json({
              user: user,
              token: newToken
            });
          }
        ).catch(err => {
          res.status(403).json('no token to refresh !');
        })
      });
    } else {
      res.status(403).json('no token to refresh !');
    }
  
  }