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

export default class GatewayBuilder {
  public static async buildGateways(): Promise<{
    userDbGateway: UserDatabaseGateway;
    activityDbGateway: ActivityDatabaseGateway;
    projectDbGateway: ProjectDatabaseGateway;
    expenseAccountDBGateway: ExpenseAccountDatabaseGateway;
    timelineDBGateway: TimelineDatabaseGateway;
  }> {
    const sequelize = getSequelize();

    const userDbGateway = new UserDataBaseGatewayImpl(sequelize);
    const activityDbGateway = new ActivityDataBaseGatewayImpl(sequelize);
    const projectDbGateway = new ProjectDataBaseGatewayImpl(sequelize);
    const expenseAccountDBGateway = new ExpenseAccountDataBaseGatewayImpl(
      sequelize
    );
    const timelineDBGateway = new TimelineDataBaseGatewayImpl(sequelize);

    console.log(`1`.repeat(100));
    await sequelize.sync({ force: true });
    console.log(`2`.repeat(100));

    return {
      userDbGateway,
      activityDbGateway,
      projectDbGateway,
      expenseAccountDBGateway,
      timelineDBGateway,
    };
  }
}
