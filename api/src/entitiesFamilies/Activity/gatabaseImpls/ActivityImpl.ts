const { DataTypes, Model, Sequelize } = require("sequelize");
const Op = Sequelize.Op;

export default class ActivityImpl extends Model {
  public static initModel(sequelize) {
    ActivityImpl.deleteById = (id) => {
      return ActivityImpl.destroy({
        where: {
          id: id,
        },
      });
    };

    ActivityImpl.isNameUnique = (name, id) => {
      return ActivityImpl.findAll({
        where: {
          [Op.and]: [
            {
              id: {
                [Op.ne]: id,
              },
            },
            { name: name },
          ],
        },
        raw: true,
      });
    };

    ActivityImpl.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING,
        },
      },
      {
        indexes: [{ unique: true, fields: ["id"] }],
        sequelize,
        modelName: "Activity",
      }
    );
  }

  public static caca() {}
}
