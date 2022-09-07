'use strict';

import { Op, Sequelize } from 'sequelize';

import TimelineImpl from './Timeline.impl';
import ExpenseAccountImpl from '../../ExpenseAccount/DatabaseImpl/ExpenseAccountImpl';
import Timeline from '../Entities/Timeline';
import TimelineDatabaseGateway from '../DatabaseGateway/TimelineDatabaseGateway';
import * as _ from 'lodash';
import UserImpl from '../../User/databaseImpls/userImpl';
import ProjectImpl from '../../Project/databaseImpls/ProjectImpl';
import ActivityImpl from '../../Activity/gatabaseImpls/ActivityImpl';
import * as console from 'console';
const moment = require('moment-timezone');

const TIMEZONE = 'America/New_York';

export default class TimelineDataBaseGatewayImpl implements TimelineDatabaseGateway {
  private sequelize;

  constructor(sequelize) {
    this.sequelize = sequelize;

    TimelineImpl.initModel(sequelize);

    UserImpl.hasMany(TimelineImpl);
    TimelineImpl.belongsTo(UserImpl);

    TimelineImpl.belongsTo(ProjectImpl);
    TimelineImpl.belongsTo(ActivityImpl);
    TimelineImpl.belongsTo(ExpenseAccountImpl);
  }

  public async createTimeline(props): Promise<Timeline> {
    return TimelineImpl.create(props);
  }

  public async getAllFromReqParams(params): Promise<Timeline[]> {
    let whereClauses = TimelineDataBaseGatewayImpl.fetchWhereClauseFromParams(params);
    return TimelineImpl.findAll({
      where: whereClauses,
      order: [['id', 'DESC']],
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

  public async getReportFromReqParams(params): Promise<Timeline[]> {
    let whereClauses = TimelineDataBaseGatewayImpl.fetchWhereClauseFromParams(params);

    console.log('8'.repeat(100));
    console.log(JSON.stringify({ whereClauses, params }, null, 2));
    console.log('-'.repeat(100));

    return TimelineImpl.findAll({
      include: {
        model: ExpenseAccountImpl,
        attributes: [
          ['name', 'nom'],
          ['id', 'id'],
          ['ExpenseAccountId', 'parentId'],
        ],
      },
      attributes: [[Sequelize.fn('sum', Sequelize.literal('punchOut - punchIn')), 'seconds']],
      group: ['Timeline.id'],
      where: whereClauses,
      raw: true,
    });
  }

  private static fetchWhereClauseFromParams(params) {
    let whereClauses: any = {};

    const activitiesIds = _.map(params.activitys, (a) => a.id);
    if (activitiesIds.length > 0) {
      whereClauses.ActivityId = activitiesIds;
    }

    const projectsIds = _.map(params.projects, (p) => p.id);
    if (projectsIds.length > 0) {
      whereClauses.ProjectId = projectsIds;
    }

    const usersIds = _.map(params.users, (u) => u.id);
    if (usersIds.length > 0) {
      whereClauses.UserId = usersIds;
    }

    if (params.debut) {
      whereClauses.punchIn = { [Op.gte]: fetchPunchIn(params.debut) };
    }

    if (params.fin) {
      whereClauses.punchOut = { [Op.lte]: fetchPunchOut(params.fin) };
    }

    return whereClauses;
  }
}

function fetchPunchIn(day) {
  const time = moment.tz(day + ' ' + '00:00', TIMEZONE);
  return time.unix();
}

function fetchPunchOut(day) {
  const time = moment.tz(day + ' ' + '23:59', TIMEZONE);
  return time.unix();
}
