import Timeline from '../Entities/Timeline';

const { DataTypes, Model } = require('sequelize');

export default class TimelineImpl extends Model implements Timeline {
  public static initModel(sequelize) {
    TimelineImpl.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        punchIn: {
          type: DataTypes.BIGINT,
        },
        punchOut: {
          type: DataTypes.BIGINT,
        },
        project: {
          type: DataTypes.INTEGER,
          references: {
            model: sequelize.models.Project,
            key: 'id',
          },
        },
      },
      {
        indexes: [{ unique: true, fields: ['id'] }],
        sequelize,
        modelName: 'Timeline',
      }
    );
  }

  id?: number;
  name: string;
  punchIn: number;
  punchOut: number;
}
