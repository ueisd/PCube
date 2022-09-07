'use strict';

import { UseCaseActivator } from '../../../delivery/Requestors/UseCaseActivator';
import { UseCaseRequest } from '../../../delivery/Requestors/UseCaseRequest';
import ExpenseAccountDatabaseGateway from '../../../EntitiesFamilies/ExpenseAccount/DatabaseGateway/ExpenseAccountDatabaseGateway';
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
