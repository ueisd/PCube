export class ExpenseAccountItem {
    id : number;
    name : string;
    parent_id: number;
    child_expense_account: ExpenseAccountItem[];

    constructor(expenseAccountResponse?: any) {
        this.id = expenseAccountResponse && expenseAccountResponse.id || "";
        this.name = expenseAccountResponse && expenseAccountResponse.name || "";
        this.parent_id = expenseAccountResponse && expenseAccountResponse.parent_id || "";
        this.child_expense_account = expenseAccountResponse && expenseAccountResponse.child || [];
    }
}