"use strict";

import { getSequelize } from "../../configuration/sequelize";
import UserDataBaseGatewayImpl from "../User/databaseImpls/databaseGateway.impl";
import ActivityDataBaseGatewayImpl from "../Activity/gatabaseImpls/DatabaseGateway.impl";
import ProjectDataBaseGatewayImpl from "../Project/databaseImpls/databaseGateway.impl";
import ExpenseAccountDataBaseGatewayImpl from "../ExpenseAccount/DatabaseImpl/DatabaseGateway.impl";
import TimelineDataBaseGatewayImpl from "../Timeline/DatabaseImpl/DatabaseGateway.impl";
import UserDatabaseGateway from "../User/databaseGateway/UserDatabaseGateway";
import ActivityDatabaseGateway from "../Activity/databaseGateway/ActivityDatabaseGateway";
import ProjectDatabaseGateway from "../Project/databaseGateway/ProjectDatabaseGateway";
import ExpenseAccountDatabaseGateway from "../ExpenseAccount/DatabaseGateway/ExpenseAccountDatabaseGateway";
import TimelineDatabaseGateway from "../Timeline/DatabaseGateway/TimelineDatabaseGateway";

export default class GatewayRegisterImpl {
  static userDbGateway: UserDatabaseGateway;
  static activityDbGateway: ActivityDatabaseGateway;
  static projectDbGateway: ProjectDatabaseGateway;
  static expenseAccountDBGateway: ExpenseAccountDatabaseGateway;
  static timelineDBGateway: TimelineDatabaseGateway;

  public static async buildGateways(): Promise<{
    userDbGateway: UserDatabaseGateway;
    activityDbGateway: ActivityDatabaseGateway;
    projectDbGateway: ProjectDatabaseGateway;
    expenseAccountDBGateway: ExpenseAccountDatabaseGateway;
    timelineDBGateway: TimelineDatabaseGateway;
  }> {
    const sequelize = getSequelize();

    GatewayRegisterImpl.userDbGateway = new UserDataBaseGatewayImpl(sequelize);
    GatewayRegisterImpl.activityDbGateway = new ActivityDataBaseGatewayImpl(
      sequelize
    );
    GatewayRegisterImpl.projectDbGateway = new ProjectDataBaseGatewayImpl(
      sequelize
    );
    GatewayRegisterImpl.expenseAccountDBGateway =
      new ExpenseAccountDataBaseGatewayImpl(sequelize);
    GatewayRegisterImpl.timelineDBGateway = new TimelineDataBaseGatewayImpl(
      sequelize
    );

    console.log(`1`.repeat(100));
    await sequelize.sync({ force: true });
    console.log(`2`.repeat(100));

    return {
      userDbGateway: GatewayRegisterImpl.userDbGateway,
      activityDbGateway: GatewayRegisterImpl.activityDbGateway,
      projectDbGateway: GatewayRegisterImpl.projectDbGateway,
      expenseAccountDBGateway: GatewayRegisterImpl.expenseAccountDBGateway,
      timelineDBGateway: GatewayRegisterImpl.timelineDBGateway,
    };
  }
}
