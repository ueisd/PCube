'use strict';

const { DataTypes, Model } = require('sequelize');
import Project from '../entities/Project';

export default class ProjectImpl extends Model {
  public static initModel(sequelize) {
    ProjectImpl.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        indexes: [{ unique: true, fields: ['id'] }],
        sequelize,
        modelName: 'Project',
      }
    );
  }
}
