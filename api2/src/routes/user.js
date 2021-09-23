const router = require('express').Router();
const fs = require('fs');
const RSA_PUBLIC_KEY = fs.readFileSync('./src/rsa/key.pub');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user.model');
const { Role } = require('../models/role.model');

function isLoggedIn(req, res, next) {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, RSA_PUBLIC_KEY, (err, decoded) => {
      if (err) { return res.status(401).json('token invalid'); }
      const sub = decoded.sub;
      User.findByPk(sub, {raw: true, include: Role})
      .then(response => {
        req.user = response;
        next();
      })
      .catch(err => {
        console.log(err);
        res.status(401).json('error');
      });

      /*User.findOne({ '_id': sub }).exec( (err, user) => {
        if (err || !user) { res.status(401).json('error') }
        req.user = user;
        next();
      })*/
    })
  } else {
    res.status(401).json('pas de token !');
  }
}

router.get('/curent', isLoggedIn, (req, res) => {
  let test = req.user;
  res.json(req.user);
});

router.get('/', isLoggedIn, (req, res) => {
  User.findAllEager().then(response => {
    res.json(response);
  })
  .catch(err => {
    console.log(err);
    res.status(401).json('error');
  });
  let test = 6;
});




module.exports = router;