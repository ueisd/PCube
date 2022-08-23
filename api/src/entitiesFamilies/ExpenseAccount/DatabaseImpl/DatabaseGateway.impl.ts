"use strict";

import _ = require("lodash");

import { Op } from "sequelize";

import ExpenseAccountImpl from "./ExpenseAccountImpl";
import ExpenseAccount from "../Entities/ExpenseAccount";

export default class ExpenseAccountDataBaseGatewayImpl {
  private sequelize;

  constructor(sequelize) {
    this.sequelize = sequelize;

    ExpenseAccountImpl.initModel(sequelize);
  }

  public async createExpenseAccount(props: {
    name: string;
  }): Promise<ExpenseAccount> {
    return ExpenseAccountImpl.create(props);
  }

  public async addSubExpenseAccounts(
    expenseAccount,
    subExpenseAccount
  ): Promise<void> {
    const expenseAccountRes: ExpenseAccountImpl =
      await ExpenseAccountImpl.findOne({
        where: {
          id: expenseAccount.id,
        },
        raw: false,
      });

    const subExpenseAccountIds = _.map(
      subExpenseAccount,
      (subExpenseAccount): number => subExpenseAccount.id
    );

    await expenseAccountRes.addExpenseAccounts(subExpenseAccountIds);
  }

  public async isNameUnique(name, id): Promise<ExpenseAccount[]> {
    return ExpenseAccountImpl.findAll({
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

  public async deleteById(id): Promise<any> {
    return ExpenseAccountImpl.destroy({
      where: {
        id: id,
      },
    });
  }
}