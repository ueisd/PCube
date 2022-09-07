'use strict';

import ActivityImpl from './ActivityImpl';
import Activity from '../entities/Activity';
import ActivityDatabaseGateway from '../databaseGateway/ActivityDatabaseGateway';

export default class ActivityDataBaseGatewayImpl implements ActivityDatabaseGateway {
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

  public async listAll(): Promise<Activity[]> {
    return ActivityImpl.findAll({
      order: [['id', 'DESC']],
      raw: true,
    });
  }

  public async updateActivity(id: number, props: any): Promise<Activity> {
    return ActivityImpl.update(props, { where: { id } });
  }

  public async findActivityById(id): Promise<Activity> {
    return ActivityImpl.findByPk(id, { raw: true });
  }

  public async isActivityNameExist(name: string): Promise<boolean> {
    const res = await ActivityImpl.findAll({
      where: { name },
      raw: true,
    });

    return !(!res || !res[0]);
  }

  public async deleteActivityById(id: number): Promise<any> {
    return ActivityImpl.destroy({ where: { id } });
  }
}
