'use strict';

import { UseCaseActivator } from '../../../system/Requestors/UseCaseActivator';
import { UseCaseRequest } from '../../../system/Requestors/UseCaseRequest';
import { CreateExpenseAccountRequest } from './CreateExpenseAccountRequest';
import ExpenseAccountDatabaseGateway from '../../../entitiesFamilies/ExpenseAccount/DatabaseGateway/ExpenseAccountDatabaseGateway';

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
