import ExpenseAccountImpl from "../../ExpenseAccount/DatabaseImpl/ExpenseAccountImpl";
import UserImpl from "../../User/databaseImpls/userImpl";
import ProjectImpl from "../../Project/databaseImpls/ProjectImpl";
import ActivityImpl from "../../Activity/gatabaseImpls/ActivityImpl";
import Timeline from "../Entities/Timeline";

const { DataTypes, Model } = require("sequelize");

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
      },
      {
        indexes: [{ unique: true, fields: ["id"] }],
        sequelize,
        modelName: "Timeline",
      }
    );

    UserImpl.hasMany(TimelineImpl);
    TimelineImpl.belongsTo(UserImpl);

    TimelineImpl.belongsTo(ProjectImpl);
    TimelineImpl.belongsTo(ActivityImpl);
    TimelineImpl.belongsTo(ExpenseAccountImpl);
  }
}
