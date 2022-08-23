"use strict";

import { Op, Sequelize } from "sequelize";

import TimelineImpl from "./Timeline.impl";
import ExpenseAccountImpl from "../../ExpenseAccount/DatabaseImpl/ExpenseAccountImpl";
import Timeline from "../Entities/Timeline";
import TimelineDatabaseGateway from "../DatabaseGateway/TimelineDatabaseGateway";

export default class TimelineDataBaseGatewayImpl
  implements TimelineDatabaseGateway
{
  private sequelize;

  constructor(sequelize) {
    this.sequelize = sequelize;

    TimelineImpl.initModel(sequelize);
  }

  public async createTimeline(props): Promise<Timeline> {
    return TimelineImpl.create(props);
  }

  public async getAllFromReqParams(params): Promise<Timeline[]> {
    let whereClauses =
      TimelineDataBaseGatewayImpl.fetchWhereClauseFromParams(params);
    return TimelineImpl.findAll({
      where: whereClauses,
      order: [["id", "DESC"]],
      raw: true,
    });
  }

  public async getTimelineById(timelineId): Promise<Timeline> {
    return TimelineImpl.findOne({
      where: {
        id: timelineId,
      },
      raw: true,
    });
  }

  public async getReportFromReqRarams(params): Promise<Timeline[]> {
    let whereClauses =
      TimelineDataBaseGatewayImpl.fetchWhereClauseFromParams(params);

    return TimelineImpl.findAll({
      include: {
        model: ExpenseAccountImpl,
        attributes: [
          ["name", "nom"],
          ["id", "id"],
          ["ExpenseAccountId", "parentId"],
        ],
      },
      attributes: [
        [
          Sequelize.fn("sum", Sequelize.literal("punchOut - punchIn")),
          "seconds",
        ],
      ],
      group: ["Timeline.id"],
      where: whereClauses,
      raw: true,
    });
  }

  private static fetchWhereClauseFromParams(params) {
    let whereClauses: any = {};

    let actyvitys = params.activitys;
    let activitysIds =
      actyvitys.length > 0 ? actyvitys.map((activity) => activity.id) : [];
    if (activitysIds.length > 0) whereClauses.ActivityId = activitysIds;

    let projects = params.projects;
    let projectsIds =
      projects.length > 0 ? projects.map((project) => project.id) : [];
    if (projectsIds.length > 0) whereClauses.ProjectId = projectsIds;

    let users = params.users;
    let usersIds = users.length > 0 ? users.map((user) => user.id) : [];
    if (usersIds.length > 0) whereClauses.UserId = usersIds;

    if (params.debut) whereClauses.punchIn = { [Op.gte]: params.debut };

    if (params.fin) whereClauses.punchOut = { [Op.lte]: params.fin };

    return whereClauses;
  }
}
