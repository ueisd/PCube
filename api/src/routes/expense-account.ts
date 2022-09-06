const router = require('express').Router();
import { isLoggedIn } from '../guards/isLoggedIn.guard';

export function getRouter() {
  // @todo mettre en place les contraintes : pas supprimer quand des lignes detemps existent
  router.get('/is-deletable/:id', isLoggedIn, (req, res) => {
    let id = req.params.id;
    res.json(true);
  });

  return router;
}
