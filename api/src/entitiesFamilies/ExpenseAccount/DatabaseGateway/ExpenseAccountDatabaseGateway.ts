"use strict";

import ExpenseAccount from "../Entities/ExpenseAccount";

export default interface ExpenseAccountDatabaseGateway {
  createExpenseAccount(props: { name: string }): Promise<ExpenseAccount>;
  addSubExpenseAccounts(expenseAccount, subExpenseAccount): Promise<void>;
  isNameUnique(name, id): Promise<ExpenseAccount[]>;
  deleteById(id): Promise<any>;
}
