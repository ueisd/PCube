var nconf = require('nconf');

//models
import * as bcrypt from "bcrypt";
import User from '../../models/user.model';


  const signingLocal = (req, res, next) => {
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
            let response: any = {
              user: user
            };
            let rsa_key_private = nconf.get('rsaKeyPrivate');
            let timeRefresh = nconf.get('jwt_refresh_token_expires');
            response.token = jwtSignId(user.id, rsa_key_private, timeRefresh);
            res.status(200).json(response); 
          }
        }
        
    }).catch(error => {
        res.status(401).json('signin fail with error!: ' + error);
    });
  }
  
  
  const refreshToken = (req, res, next) => {
    
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
          expiresIn: nconf.get('jwt_refresh_token_expires'),
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


module.exports = {
  signingLocal,
  refreshToken,
}