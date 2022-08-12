const router = require('express').Router();
const auth = require('./auth');
const user = require('./user');
const addRoles = require('./roles').addRolesRoutes;
const { addRoutesToRouter: addActivityRoutesToRouter } = require('./activity');
const projets = require('./projects');
const expenseAccounts = require('./expense-account');
const timelines = require('./timelines');

router.use('/api/auth', auth);
router.use('/api/user', user);
router.use('/api/roles', addRoles(router));
router.use('/api/activity', addActivityRoutesToRouter(router));
router.use('/api/project', projets);
router.use('/api/expense-account', expenseAccounts);
router.use('/api/timeline', timelines);

module.exports = router;