'use strict';

import { UseCaseActivator } from '../../../system/Requestors/UseCaseActivator';
import { UseCaseRequest } from '../../../system/Requestors/UseCaseRequest';
import { CheckExpenseAccountNameExistRequest } from './CheckExpenseAccountNameExistRequest';
import ExpenseAccountDatabaseGateway from '../../../entitiesFamilies/ExpenseAccount/DatabaseGateway/ExpenseAccountDatabaseGateway';

export class CheckExpenseAccountNameExistInterractor implements UseCaseActivator {
  private expenseAccountDb: ExpenseAccountDatabaseGateway;

  constructor(expenseAccountDb: ExpenseAccountDatabaseGateway) {
    this.expenseAccountDb = expenseAccountDb;
  }

  public async execute(request: UseCaseRequest): Promise<Boolean> {
    const { name } = request as CheckExpenseAccountNameExistRequest;

    return await this.isExpenseAccountNameExist(name);
  }

  private async isExpenseAccountNameExist(name) {
    return this.expenseAccountDb.isExpenseAccountNameExist(name);
  }
}
