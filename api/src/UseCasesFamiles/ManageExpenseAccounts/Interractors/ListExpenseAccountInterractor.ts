'use strict';

import { UseCaseActivator } from '../../../delivery/Requestors/UseCaseActivator';
import { NotFoundError } from '../../../delivery/Requestors/Errors/NotFoundError';
import ActivityDatabaseGateway from '../../../EntitiesFamilies/Activity/databaseGateway/ActivityDatabaseGateway';
import Activity from '../../../EntitiesFamilies/Activity/entities/Activity';
import ProjectDatabaseGateway from '../../../EntitiesFamilies/Project/databaseGateway/ProjectDatabaseGateway';
import Project from '../../../EntitiesFamilies/Project/entities/Project';
import { ListExpenseAccountsController } from '../Controllers/ListExpenseAccountsController';
import ExpenseAccountDatabaseGateway from '../../../EntitiesFamilies/ExpenseAccount/DatabaseGateway/ExpenseAccountDatabaseGateway';

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
