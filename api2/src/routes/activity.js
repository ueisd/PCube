const router = require('express').Router();
const { isLoggedIn } = require('../guards/isLoggedIn.guard');
const { Activity } = require('../models/activity.model');

router.post('/is-name-unique', isLoggedIn, (req, res) => {
  console.log(req.body);
  let id = req.body.activityId;
  let nameVerif = req.body.name.trim();
  Activity.isNameUnique(nameVerif, id).then(result => {
    if(result.length >0)
      res.json(false);
    else 
      res.json(true);
  }).catch(err => {
    res.status(401).json('error: ' + err);
  });
});

router.post('/', isLoggedIn, async (req, res) => {
  let user = req.body;
  user.name = req.body.name.trim();

  Activity.create(user)
  .then(response => { 
    res.json(response);
  })
  .catch(err => {
    res.status(401).json('error' + err);
  });
});

router.delete('/:id', isLoggedIn, (req, res) => {
  let id = req.params.id;
  Activity.deleteById(id).then(result => {
    res.json(result);
  }).catch(err => {
    res.status(401).json('error' + err);
  })
});

router.put('/', isLoggedIn, (req, res) => {
  let id = req.body.id;
  Activity.update(req.body, {
    where: {
      id: id
    }
  }).then(result => {
    res.json(result);
  }).catch(err => {
    res.status(401).json('error' + err);
  });
});

router.get('/', isLoggedIn, (req, res) => {
  console.log('Ceci est un test :)');
  Activity.findAll({raw : true}).then(response => {
    res.json(response);
  })
  .catch(err => {
    res.status(401).json('error: ' + err);
  });
});

module.exports = router;