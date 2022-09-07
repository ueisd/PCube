'use strict';

import { UseCaseActivator } from '../../../system/Requestors/UseCaseActivator';
import { NotFoundError } from '../../../system/Requestors/Errors/NotFoundError';
import ActivityDatabaseGateway from '../../../entitiesFamilies/Activity/databaseGateway/ActivityDatabaseGateway';
import Activity from '../../../entitiesFamilies/Activity/entities/Activity';
import ProjectDatabaseGateway from '../../../entitiesFamilies/Project/databaseGateway/ProjectDatabaseGateway';
import Project from '../../../entitiesFamilies/Project/entities/Project';
import { ListExpenseAccountsController } from '../Controllers/ListExpenseAccountsController';
import ExpenseAccountDatabaseGateway from '../../../entitiesFamilies/ExpenseAccount/DatabaseGateway/ExpenseAccountDatabaseGateway';

export class ListExpenseAccountInteractor implements UseCaseActivator {
  private expenseAccountDb: ExpenseAccountDatabaseGateway;

  constructor(expenseAccountDb: ExpenseAccountDatabaseGateway) {
    this.expenseAccountDb = expenseAccountDb;
  }

  public async execute() {
    return this.tryListExpenseAccounts();
  }

  private async tryListExpenseAccounts(): Promise<Project[]> {
    const expenseAccounts: Project[] = await this.expenseAccountDb.listAll();

    if (!expenseAccounts) {
      throw new NotFoundError(`Pas d'expense accounts!`);
    }

    return expenseAccounts;
  }
}
