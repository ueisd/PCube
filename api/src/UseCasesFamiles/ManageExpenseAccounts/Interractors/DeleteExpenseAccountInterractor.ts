'use strict';

import { UseCaseActivator } from '../../../delivery/Requestors/UseCaseActivator';
import { UseCaseRequest } from '../../../delivery/Requestors/UseCaseRequest';
import ExpenseAccountDatabaseGateway from '../../../EntitiesFamilies/ExpenseAccount/DatabaseGateway/ExpenseAccountDatabaseGateway';
import { DeleteExpenseAccountRequest } from './DeleteExpenseAccountRequest';

export class DeleteExpenseAccountInterractor implements UseCaseActivator {
  private expenseAccountDb: ExpenseAccountDatabaseGateway;

  constructor(expenseAccountDb: ExpenseAccountDatabaseGateway) {
    this.expenseAccountDb = expenseAccountDb;
  }

  public async execute(request: UseCaseRequest): Promise<boolean> {
    const { id } = request as DeleteExpenseAccountRequest;

    const res = await this.expenseAccountDb.deleteExpenseAccountById(id);

    checkDeleteHasAffectedRows(res, id);

    return true;
  }
}

function checkDeleteHasAffectedRows(res, id) {
  if (res !== 1) {
    throw new Error(`La base de donnée ne peut supprimer le compte de dépense avec l'id ${id}.`);
  }
}
