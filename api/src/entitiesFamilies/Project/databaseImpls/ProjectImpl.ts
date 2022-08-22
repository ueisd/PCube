// @ts-ignore
import {
  DataTypes,
  Model,
  Op,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  BelongsToSetAssociationMixin,
  HasManyGetAssociationsMixin,
} from "sequelize";
import Project from "../entities/Project";

export default class ProjectImpl
  extends Model<
    InferAttributes<ProjectImpl>,
    InferCreationAttributes<ProjectImpl>
  >
  implements Project
{
  declare id: CreationOptional<number>;
  declare name: string;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare projects?: NonAttribute<ProjectImpl[]>;

  declare addProjects: HasManyAddAssociationsMixin<ProjectImpl, number>;
  declare setProject: BelongsToSetAssociationMixin<
    ProjectImpl,
    ProjectImpl["id"]
  >;
  declare getProjects: HasManyGetAssociationsMixin<Project>; // Note the null assertions!

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
        indexes: [{ unique: true, fields: ["id"] }],
        sequelize,
        modelName: "Project",
      }
    );

    ProjectImpl.belongsTo(ProjectImpl, { targetKey: "id" });
    ProjectImpl.hasMany(ProjectImpl);
  }

  public static deleteById(id) {
    return ProjectImpl.destroy({
      where: {
        id: id,
      },
    });
  }

  public static isNameUnique(name, id) {
    return ProjectImpl.findAll({
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
  }
}
