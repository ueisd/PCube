'use strict';

import { UseCaseActivator } from '../../../system/Requestors/UseCaseActivator';
import { UseCaseRequest } from '../../../system/Requestors/UseCaseRequest';
import ExpenseAccountDatabaseGateway from '../../../entitiesFamilies/ExpenseAccount/DatabaseGateway/ExpenseAccountDatabaseGateway';
import { UpdateExpenseAccountRequest } from './UpdateExpenseAccountRequest';

export class UpdateExpenseAccountInterractor implements UseCaseActivator {
  private expenseAccountDb: ExpenseAccountDatabaseGateway;

  constructor(expenseAccountDb: ExpenseAccountDatabaseGateway) {
    this.expenseAccountDb = expenseAccountDb;
  }

  public async execute(request: UseCaseRequest) {
    const { id, ...props } = request as UpdateExpenseAccountRequest;

    const res = await this.expenseAccountDb.updateExpenseAccount(id, props);

    checkUpdateHasAffectedRows(res);

    // TODO gerer erreure
    return this.expenseAccountDb.findExpenseAccountById(id);
  }
}

function checkUpdateHasAffectedRows(res) {
  if (res[0] === 0) {
    throw new Error("Le compte de dépense n'a pas été updaté");
  }
}
