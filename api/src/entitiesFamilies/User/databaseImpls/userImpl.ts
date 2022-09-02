import User from '../entities/User';

const { DataTypes, Model, Sequelize } = require('sequelize');
const Op = Sequelize.Op;

export default class UserImpl extends Model {
  public static initModel(sequelize) {
    UserImpl.isEmailUnique = (email, id) => {
      return UserImpl.findAll({
        where: {
          [Op.and]: [
            {
              id: {
                [Op.ne]: id,
              },
            },
            { email: email },
          ],
        },
        raw: true,
      });
    };

    UserImpl.findAllEager = () => {
      return UserImpl.findAll({
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: sequelize.models.Role,
          },
        ],
        raw: true,
      });
    };

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
