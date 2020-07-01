export class ExpenseAccountItem {
    id : number;
    name : string;
    parent_id: number;
    child_expense_account: ExpenseAccountItem[];

    constructor(expenseAccountResponse?: any) {
        this.id = expenseAccountResponse && expenseAccountResponse.id || -1;
        this.name = expenseAccountResponse && expenseAccountResponse.name || "";
        this.parent_id = expenseAccountResponse && expenseAccountResponse.parent_id || -1;
        this.child_expense_account = expenseAccountResponse && expenseAccountResponse.child || [];
    }
}