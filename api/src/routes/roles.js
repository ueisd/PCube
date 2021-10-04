const router = require('express').Router();
const { isLoggedIn } = require('../guards/isLoggedIn.guard');
const { Role } = require('../models/role.model');

router.get('/', isLoggedIn, (req, res) => {
    Role.findAll({raw : true}).then(response => {
      res.json(response);
    })
    .catch(err => {
      res.status(401).json('error');
    });
  });

module.exports = router;