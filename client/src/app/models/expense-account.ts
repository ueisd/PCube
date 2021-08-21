export class ExpenseAccountItem {
    id : number;
    name : string;
    parent_id: number;
    child: ExpenseAccountItem[];
    nomAffichage: string;
    nbLignesDeTemps: number;

    constructor(expenseAccountResponse?: any) {
        this.id = expenseAccountResponse && expenseAccountResponse.id || "";
        this.name = expenseAccountResponse && expenseAccountResponse.name || "";
        this.parent_id = expenseAccountResponse && expenseAccountResponse.parent_id || "";
        this.nomAffichage = expenseAccountResponse && expenseAccountResponse.nomAffichage || "";
        this.child = expenseAccountResponse && expenseAccountResponse.child || [];
        this.nbLignesDeTemps = expenseAccountResponse && expenseAccountResponse.nbLignesDeTemps || "";
    }
}