import { OnInit, Component } from '@angular/core';
import { ExpenseAccountItem } from 'src/app/models/expense-account';
import { ExpenseAccountService } from 'src/app/services/expense-account/expense-account.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-expense-account-list',
  templateUrl: './expense-account-list.component.html',
  styleUrls: ['./expense-account-list.component.css']
})
export class ExpenseAccountListComponent implements OnInit {

  nameFilter = new FormControl('');

  constructor(private expenseAccountService: ExpenseAccountService) { }

  ngOnInit(): void {
    this.refreshList();
  }

  private transformer = (node : ExpenseAccountItem, level: number) => {
    return {
      expandable: !!node.child_expense_account && node.child_expense_account.length > 0,
      name: node.name,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level, node => node.expandable);
  
  treeFlattener = new MatTreeFlattener(
    this.transformer, node => node.level, node => node.expandable, node => node.child_expense_account);
  
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  
  hasChild = (_: number, node: FlatNode) => node.expandable;
  
  onFilterChanged() {
    this.refreshList();
  }

  refreshList() {
    let expenseAccount = new ExpenseAccountItem();
    expenseAccount.name = this.nameFilter.value.trim();
    this.expenseAccountService.filterExpenseAccount(expenseAccount).subscribe(expenseAccounts => {
      this.dataSource.data = expenseAccounts;
    });
  }
}

/** Flat node with expandable and level information */
interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}