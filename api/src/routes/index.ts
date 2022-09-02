import UserDatabaseGateway from '../entitiesFamilies/User/databaseGateway/UserDatabaseGateway';
import ActivityDatabaseGateway from '../entitiesFamilies/Activity/databaseGateway/ActivityDatabaseGateway';
import ProjectDatabaseGateway from '../entitiesFamilies/Project/databaseGateway/ProjectDatabaseGateway';
import ExpenseAccountDatabaseGateway from '../entitiesFamilies/ExpenseAccount/DatabaseGateway/ExpenseAccountDatabaseGateway';
import TimelineDatabaseGateway from '../entitiesFamilies/Timeline/DatabaseGateway/TimelineDatabaseGateway';

const router = require('express').Router();
const { getRouter: getActivityRouter } = require('./activity');
const { getRouter: getProjectRouter } = require('./projects');
const { getRouter: getExpenseAccountRouter } = require('./expense-account');
const { getRouter: getTimelineRouter } = require('./timelines');

export function initRouters({
  userDbGateway,
  activityDbGateway,
  projectDbGateway,
  expenseAccountDBGateway,
  timelineDBGateway,
}: {
  userDbGateway: UserDatabaseGateway;
  activityDbGateway: ActivityDatabaseGateway;
  projectDbGateway: ProjectDatabaseGateway;
  expenseAccountDBGateway: ExpenseAccountDatabaseGateway;
  timelineDBGateway: TimelineDatabaseGateway;
}) {
  router.use('/api/activity', getActivityRouter());
  router.use('/api/project', getProjectRouter());
  router.use('/api/expense-account', getExpenseAccountRouter());
  router.use('/api/timeline', getTimelineRouter());
  return router;
}
