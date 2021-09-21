const router = require('express').Router();
const {User} = require('../models/user.model');
const { Role } = require('../models/role.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const RSA_KEY_PRIVATE = fs.readFileSync('./src/rsa/key');
const RSA_PUBLIC_KEY = fs.readFileSync('./src/rsa/key.pub');
const timeRefresh = '1200s';

router.post('/signin', (req, res) => {
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
          response.token = jwt.sign({}, RSA_KEY_PRIVATE, {
            algorithm: 'RS256',
            expiresIn: timeRefresh,
            subject: user.id.toString()
          });
          res.status(200).json(response); 
        }
      }
      
  }).catch(error => {
      res.status(401).json('signin fail with error!: ' + error);
  });
});


//@todo mettre en place
router.get('/refresh-token', (req, res) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, RSA_PUBLIC_KEY, (err, decoded) => {
      if (err) {
        console.log("wrong token");
        return res.status(403).json('wrong token') 
      }
      const newToken = jwt.sign({}, RSA_KEY_PRIVATE, {
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

});

//@todo mettre en place
router.post('/signup', (req, res) => {
  const newUser = new User({
    email: req.body.email,
    name: req.body.name,
    password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8))
  });

  newUser.save( (err) => {
    if (err) { res.status(500).json('erreur signup') }  
    res.status(200).json('signup ok !');
  })

});



module.exports = router;
