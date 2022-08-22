import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  HasManyAddAssociationsMixin,
  BelongsToSetAssociationMixin,
  HasManyGetAssociationsMixin,
} from "sequelize";
import ExpenseAccount from "../Entities/ExpenseAccount";

export default class ExpenseAccountImpl
  extends Model<
    InferAttributes<ExpenseAccountImpl>,
    InferCreationAttributes<ExpenseAccountImpl>
  >
  implements ExpenseAccount
{
  declare id: CreationOptional<number>;
  declare name: string;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare expenseAccounts?: NonAttribute<ExpenseAccountImpl[]>;

  declare addExpenseAccounts: HasManyAddAssociationsMixin<
    ExpenseAccountImpl,
    number
  >;
  declare setExpenseAccount: BelongsToSetAssociationMixin<
    ExpenseAccountImpl,
    ExpenseAccountImpl["id"]
  >;
  declare getExpenseAccounts: HasManyGetAssociationsMixin<ExpenseAccount>; // Note the null assertions!

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
        indexes: [{ unique: true, fields: ["id"] }],
        sequelize,
        modelName: "ExpenseAccount",
      }
    );

    ExpenseAccountImpl.belongsTo(ExpenseAccountImpl, { targetKey: "id" });
    ExpenseAccountImpl.hasMany(ExpenseAccountImpl);
  }
}
