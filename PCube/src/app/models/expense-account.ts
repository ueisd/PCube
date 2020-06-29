export class ExpenseAccountItem {
    id : number;
    name : string;
    parent_id: number;
    child_expense_account: ExpenseAccountItem[];

    constructor(expenseAccountResponse: any) {
        this.id = expenseAccountResponse.id;
        this.name = expenseAccountResponse.name;
        this.parent_id = expenseAccountResponse.parent_id;
        this.child_expense_account = expenseAccountResponse.child;
    }
}