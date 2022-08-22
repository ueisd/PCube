"use strict";

import ActivityImpl from "./ActivityImpl";
import Activity from "../entities/Activity";
import ActivityDatabaseGateway from "../databaseGateway/ActivityDatabaseGateway";

export default class ActivityDataBaseGatewayImpl
  implements ActivityDatabaseGateway
{
  private sequelize;

  constructor(sequelize) {
    this.sequelize = sequelize;

    ActivityImpl.initModel(sequelize);
  }

  public async createActivity(activity: Activity): Promise<Activity> {
    const response = await ActivityImpl.create(activity);

    return new Activity({
      id: response.id,
      name: response.name,
    });
  }
}
