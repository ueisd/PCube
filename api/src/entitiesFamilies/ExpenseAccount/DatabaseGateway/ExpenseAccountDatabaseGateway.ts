'use strict';

import ExpenseAccount from '../Entities/ExpenseAccount';
import Project from '../../Project/entities/Project';

export default interface ExpenseAccountDatabaseGateway {
  createExpenseAccount(props: { name: string }): Promise<ExpenseAccount>;
  addSubExpenseAccounts(expenseAccount, subExpenseAccount): Promise<void>;
  isNameUnique(name, id): Promise<ExpenseAccount[]>;
  deleteById(id): Promise<any>;
  listAll(): Promise<Project[]>;
}
