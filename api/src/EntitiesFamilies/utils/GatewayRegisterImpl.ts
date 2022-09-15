'use strict';

import { getSequelize } from '../../configuration/sequelize';
import UserDataBaseGatewayImpl from '../User/databaseImpls/databaseGateway.impl';
import ActivityDataBaseGatewayImpl from '../Activity/gatabaseImpls/DatabaseGateway.impl';
import ProjectDataBaseGatewayImpl from '../Project/databaseImpls/databaseGateway.impl';
import ExpenseAccountDataBaseGatewayImpl from '../ExpenseAccount/DatabaseImpl/DatabaseGateway.impl';
import TimelineDataBaseGatewayImpl from '../Timeline/DatabaseImpl/DatabaseGateway.impl';
import UserDatabaseGateway from '../User/databaseGateway/UserDatabaseGateway';
import ActivityDatabaseGateway from '../Activity/databaseGateway/ActivityDatabaseGateway';
import ProjectDatabaseGateway from '../Project/databaseGateway/ProjectDatabaseGateway';
import ExpenseAccountDatabaseGateway from '../ExpenseAccount/DatabaseGateway/ExpenseAccountDatabaseGateway';
import TimelineDatabaseGateway from '../Timeline/DatabaseGateway/TimelineDatabaseGateway';

export default class GatewayRegisterImpl {
  private static userDbGateway: UserDatabaseGateway;
  private static activityDbGateway: ActivityDatabaseGateway;
  private static projectDbGateway: ProjectDatabaseGateway;
  private static expenseAccountDBGateway: ExpenseAccountDatabaseGateway;
  private static timelineDBGateway: TimelineDatabaseGateway;

  public static async buildGateways(): Promise<{
    userDbGateway: UserDatabaseGateway;
    activityDbGateway: ActivityDatabaseGateway;
    projectDbGateway: ProjectDatabaseGateway;
    expenseAccountDBGateway: ExpenseAccountDatabaseGateway;
    timelineDBGateway: TimelineDatabaseGateway;
  }> {
    const sequelize = getSequelize();

    GatewayRegisterImpl.userDbGateway = new UserDataBaseGatewayImpl();
    GatewayRegisterImpl.activityDbGateway = new ActivityDataBaseGatewayImpl(sequelize);
    GatewayRegisterImpl.projectDbGateway = new ProjectDataBaseGatewayImpl(sequelize);
    GatewayRegisterImpl.expenseAccountDBGateway = new ExpenseAccountDataBaseGatewayImpl(sequelize);
    GatewayRegisterImpl.timelineDBGateway = new TimelineDataBaseGatewayImpl(sequelize);

    return {
      userDbGateway: GatewayRegisterImpl.userDbGateway,
      activityDbGateway: GatewayRegisterImpl.activityDbGateway,
      projectDbGateway: GatewayRegisterImpl.projectDbGateway,
      expenseAccountDBGateway: GatewayRegisterImpl.expenseAccountDBGateway,
      timelineDBGateway: GatewayRegisterImpl.timelineDBGateway,
    };
  }

  public static getUserDbGateway(): UserDatabaseGateway {
    return this.userDbGateway;
  }
}
