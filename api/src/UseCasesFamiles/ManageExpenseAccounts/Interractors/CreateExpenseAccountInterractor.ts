'use strict';

import { UseCaseActivator } from '../../../delivery/Requestors/UseCaseActivator';
import { UseCaseRequest } from '../../../delivery/Requestors/UseCaseRequest';
import { CreateExpenseAccountRequest } from './CreateExpenseAccountRequest';
import ExpenseAccountDatabaseGateway from '../../../EntitiesFamilies/ExpenseAccount/DatabaseGateway/ExpenseAccountDatabaseGateway';

export class CreateExpenseAccountInterractor implements UseCaseActivator {
  private expenseAccountDb: ExpenseAccountDatabaseGateway;

  constructor(expenseAccountDb: ExpenseAccountDatabaseGateway) {
    this.expenseAccountDb = expenseAccountDb;
  }

  public async execute(request: UseCaseRequest) {
    const { name, ExpenseAccountId } = request as CreateExpenseAccountRequest;

    return this.expenseAccountDb.createExpenseAccount({ name, ExpenseAccountId });
  }
}
