"use strict";

import Activity from "../entities/Activity";

export default interface ActivityDatabaseGateway {
  createActivity(role: Activity): Promise<Activity>;
}
