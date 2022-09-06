import UserDatabaseGateway from '../entitiesFamilies/User/databaseGateway/UserDatabaseGateway';
import ActivityDatabaseGateway from '../entitiesFamilies/Activity/databaseGateway/ActivityDatabaseGateway';
import ProjectDatabaseGateway from '../entitiesFamilies/Project/databaseGateway/ProjectDatabaseGateway';
import ExpenseAccountDatabaseGateway from '../entitiesFamilies/ExpenseAccount/DatabaseGateway/ExpenseAccountDatabaseGateway';
import TimelineDatabaseGateway from '../entitiesFamilies/Timeline/DatabaseGateway/TimelineDatabaseGateway';

const router = require('express').Router();
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
  router.use('/api/timeline', getTimelineRouter());
  return router;
}
