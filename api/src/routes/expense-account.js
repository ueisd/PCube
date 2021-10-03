const router = require('express').Router();
const { isLoggedIn } = require('../guards/isLoggedIn.guard');
const { ExpenseAccount } = require('../models/expense-account.model');

router.get('/', isLoggedIn, (req, res) => {
    ExpenseAccount.findAll({raw : true}).then(response => {
        console.log(response);
        res.json(response);
    })
    .catch(err => {
        res.status(401).json('error: ' + err);
    });
});

router.put('/', isLoggedIn, (req, res) => {
    let expenseAccount = req.body;
    expenseAccount.name = expenseAccount.name.trim();
    if(expenseAccount.ExpenseAccountId <0)
        expenseAccount.ExpenseAccountId = null;
    ExpenseAccount.update(expenseAccount, {
        where: {
            id: expenseAccount.id
        }
    }).then(result => {
        res.json(result);
    }).catch(err => {
        res.status(401).json('error' + err);
    });
})

router.post('/', isLoggedIn, (req, res) => {
    let expenseAccount = req.body;
    expenseAccount.name = expenseAccount.name.trim();
    if(expenseAccount.ExpenseAccountId <0)
        expenseAccount.ExpenseAccountId = null;
    ExpenseAccount.create(expenseAccount)
    .then(response => {
        res.json(response);
    })
    .catch(err => {
        res.status(401).json('error' + err);
    });
});

router.post('/is-name-unique', isLoggedIn, (req, res) => {
    let id = req.body.id;
    let nameVerif = req.body.name.trim();
    console.log("is name unique");
    console.log(req.body);
    ExpenseAccount.isNameUnique(nameVerif, id)
    .then(result => {
        if(result.length >0)
            res.json(false);
        else 
            res.json(true);
    }).catch(err => {
        res.status(401).json('error: ' + err);
    });
});




// @todo mettre en place les contraintes : pas supprimer quand des lignes detemps existent
router.get('/is-deletable/:id', isLoggedIn, (req, res) => {
    let id = req.params.id;
    res.json(true);
});

router.delete('/:id', isLoggedIn, (req,res) => {
    let id = req.params.id;
    ExpenseAccount.deleteById(id)
    .then(result => {
        res.json(result);
    }).catch(err => {
        res.status(401).json('error' + err);
    })
})

module.exports = router;