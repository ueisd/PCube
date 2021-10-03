const router = require('express').Router();
const { User } = require('../models/user.model');
const { isLoggedIn } = require('../guards/isLoggedIn.guard');
const bcrypt = require('bcrypt');

router.get('/curent', isLoggedIn, (req, res) => {
  User.findUserById(req.user.id).then(user => {
    res.json(user)
  }).catch(err => {
    res.status(401).json('error' + err);
  })
});

router.get('/emailUnique/:email', isLoggedIn, (req, res) => {
  let email = req.params.email.trim();
  User.isEmailUnique(email, req.user.id)
  .then(result => {
    if(result.length >0)
      res.json(false);
    else 
      res.json(true);
  }).catch(err => {
    res.status(401).json('error' + err);
  });
});

router.put('/', isLoggedIn, (req, res) => {
  req.body.firstName = req.body.firstName.trim();
  req.body.lastName = req.body.lastName.trim();
  req.body.email = req.body.email.trim();
  User.update(req.body, {
    where: {
      id: req.body.id
    }
  }).then(result => {
    console.log(result);
    res.json(result);
  }).catch(err => {
    console.log(err);
    res.status(401).json('error' + err);
  });
});

router.get('/', isLoggedIn, (req, res) => {
  User.findAllEager().then(response => {
    res.json(response);
  })
  .catch(err => {
    res.status(401).json('error' + err);
  });
});

router.post('/', isLoggedIn, async (req, res) => {
  let user = req.body;
  let password = user.password.trim();
  user.password = bcrypt.hashSync(password, bcrypt.genSaltSync(8)),
  user.firstName = user.firstName.trim();
  user.lastName = user.lastName.trim();
  user.email = user.email.trim();

  User.create(user)
  .then(response => { 
    return User.findUserById(response.id);
  }).then(response => {
    res.json(response);
  })
  .catch(err => {
    res.status(401).json('error' + err);
  });
});

router.delete('/:id', isLoggedIn, (req, res) => {
  let id = req.params.id;
  User.deleteById(id).then(result => {
    res.json(result);
  }).catch(err => {
    res.status(401).json('error' + err);
  })
});

module.exports = router;