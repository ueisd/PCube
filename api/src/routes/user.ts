import UserDatabaseGateway from '../entitiesFamilies/User/databaseGateway/UserDatabaseGateway';

const router = require('express').Router();
const { User } = require('../models/user.model');
const { isLoggedIn } = require('../guards/isLoggedIn.guard');

export function getRouter(userDb: UserDatabaseGateway) {
  router.get('/emailUnique/:email', isLoggedIn, (req, res) => {
    let email = req.params.email.trim();
    User.isEmailUnique(email, req.user.id)
      .then((result) => {
        if (result.length > 0) res.json(false);
        else res.json(true);
      })
      .catch((err) => {
        res.status(401).json('error' + err);
      });
  });

  router.put('/', isLoggedIn, (req, res) => {
    req.body.firstName = req.body.firstName.trim();
    req.body.lastName = req.body.lastName.trim();
    req.body.email = req.body.email.trim();
    User.update(req.body, {
      where: {
        id: req.body.id,
      },
    })
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res.status(401).json('error' + err);
      });
  });

  router.delete('/:id', isLoggedIn, (req, res) => {
    let id = req.params.id;
    User.deleteById(id)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res.status(401).json('error' + err);
      });
  });

  return router;
}
