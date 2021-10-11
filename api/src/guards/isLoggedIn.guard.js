const { User } = require('../models/user.model');
const { Role } = require('../models/role.model');
const fs = require('fs');
const jwt = require('jsonwebtoken');
var nconf = require('nconf');
//const FILE_RSA_PUBLIC_KEY = fs.readFileSync('./src/rsa/key.pub');

module.exports.isLoggedIn = async function (req, res, next) {
  let nconfPublicKey = nconf.get('rsaKeyPublic');
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, nconfPublicKey, (err, decoded) => {
      if (err) { return res.status(401).json('token invalid'); }
      const sub = decoded.sub;
      User.findByPk(sub, {raw: true, include: Role})
      .then(response => {
        req.user = response;
        next();
      })
      .catch(err => {
        res.status(401).json('error');
      });
    })
  } else {
    res.status(401).json('pas de token !');
  }
}