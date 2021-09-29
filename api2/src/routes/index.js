const router = require('express').Router();
const auth = require('./auth');
const user = require('./user');
const roles = require('./roles');
const activitys = require('./activity');
const projets = require('./projects');
const expenseAccounts = require('./expense-account');

router.use('/api/auth', auth);
router.use('/api/user', user);
router.use('/api/roles', roles);
router.use('/api/activity', activitys);
router.use('/api/project', projets);
router.use('/api/expense-account', expenseAccounts);

module.exports = router;