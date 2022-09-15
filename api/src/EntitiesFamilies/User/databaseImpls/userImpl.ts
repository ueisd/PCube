import User from '../entities/User';

const { DataTypes, Model } = require('sequelize');

export default class UserImpl extends Model {
  public static initModel(sequelize) {
    UserImpl.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        firstName: {
          type: DataTypes.STRING,
          allowNull: false,
          field: 'firstName',
        },
        lastName: {
          type: DataTypes.STRING,
          allowNull: false,
          field: 'lastName',
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        }, //@todo on pourait supprimer le salt?
        isActive: {
          //@todo voir ce que ça fait..
          type: DataTypes.BOOLEAN,
        },
        role: {
          type: DataTypes.INTEGER,
          references: {
            model: sequelize.models.Role,
            key: 'id',
          },
        },
      },
      {
        indexes: [
          { unique: true, fields: ['id'] },
          { unique: true, fields: ['email'] },
        ],
        sequelize,
        modelName: 'User',
      }
    );
  }
}
