const router = require('express').Router();
import { isLoggedIn } from '../guards/isLoggedIn.guard';
const { ExpenseAccount } = require('../models/expense-account.model');

export function getRouter() {
  // router.put('/', isLoggedIn, (req, res) => {
  //   let expenseAccount = req.body;
  //   expenseAccount.name = expenseAccount.name.trim();
  //   if (expenseAccount.ExpenseAccountId < 0) expenseAccount.ExpenseAccountId = null;
  //   ExpenseAccount.update(expenseAccount, {
  //     where: {
  //       id: expenseAccount.id,
  //     },
  //   })
  //     .then((result) => {
  //       res.json(result);
  //     })
  //     .catch((err) => {
  //       res.status(401).json('error' + err);
  //     });
  // });

  // @todo mettre en place les contraintes : pas supprimer quand des lignes detemps existent
  router.get('/is-deletable/:id', isLoggedIn, (req, res) => {
    let id = req.params.id;
    res.json(true);
  });

  router.delete('/:id', isLoggedIn, (req, res) => {
    let id = req.params.id;
    ExpenseAccount.deleteById(id)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res.status(401).json('error' + err);
      });
  });

  return router;
}
