const { DataTypes, Model, Sequelize } = require('sequelize');
import ExpenseAccount from '../Entities/ExpenseAccount';

export default class ExpenseAccountImpl extends Model implements ExpenseAccount {
  id?: number;
  name: string;

  public static initModel(sequelize) {
    ExpenseAccountImpl.init(
      {
        id: {
          type: DataTypes.INTEGER,
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
        modelName: 'ExpenseAccount',
      }
    );
  }
}
