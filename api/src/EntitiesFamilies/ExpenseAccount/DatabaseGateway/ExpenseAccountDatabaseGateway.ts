'use strict';

import ExpenseAccount from '../Entities/ExpenseAccount';

export default interface ExpenseAccountDatabaseGateway {
  createExpenseAccount(props: { name: string; ExpenseAccountId?: number }): Promise<ExpenseAccount>;
  addSubExpenseAccounts(expenseAccount, subExpenseAccount): Promise<void>;
  isNameUnique(name, id): Promise<ExpenseAccount[]>;
  deleteById(id): Promise<any>;
  listAll(): Promise<ExpenseAccount[]>;
  isExpenseAccountNameExist(name: string): Promise<boolean>;
  updateExpenseAccount(id: number, props: any): Promise<ExpenseAccount>;
  findExpenseAccountById(expenseAccountId: number): Promise<ExpenseAccount>;
  deleteExpenseAccountById(id: number): Promise<any>;
}
