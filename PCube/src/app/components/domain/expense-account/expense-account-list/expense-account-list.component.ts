import { OnInit, Component } from '@angular/core';
import { ExpenseAccountItem } from 'src/app/models/expense-account';
import { ExpenseAccountService } from 'src/app/services/expense-account/expense-account.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FormControl } from '@angular/forms';
import { MatDialogConfig, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddExpenseAccountComponent } from '../add-expense-account/add-expense-account.component';

@Component({
  selector: 'app-expense-account-list',
  templateUrl: './expense-account-list.component.html',
  styleUrls: ['./expense-account-list.component.css']
})
export class ExpenseAccountListComponent implements OnInit {

  nameFilter = new FormControl('');
  fileNameDialogRef: MatDialogRef<AddExpenseAccountComponent>;

  constructor(private expenseAccountService: ExpenseAccountService,
    private dialog: MatDialog, private snackBar : MatSnackBar) { }

  ngOnInit(): void {
    this.refreshList();
  }


  private _transformer = (node : ExpenseAccountItem, level: number) => {
    let expensenoChild: ExpenseAccountItem = new ExpenseAccountItem(node);
    expensenoChild.child = [];
    return {
      expandable: !!node.child && node.child.length > 0,
      id: node.id,
      name: node.name,
      level: level,
      parent_id: node.parent_id,
      expenseAcount: expensenoChild, 
    };
  }

  openEditDialog(compte : ExpenseAccountItem) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { 
      expenseAccount : compte,
    }
    dialogConfig.minWidth = 600;
    this.fileNameDialogRef = this.dialog.open(AddExpenseAccountComponent, dialogConfig);
    
    this.fileNameDialogRef.afterClosed().subscribe(result => { 
        if(result == true) {
          this.refreshList();
          this.openSnackBar('L\'activité a été modifiée', 'notif-success');
        }
      }
    );
  }

  openSnackBar(message, panelClass) {
    this.snackBar.open(message, 'Fermer', {
      duration: 2000,
      horizontalPosition: "right",
      verticalPosition: "bottom",
      panelClass: [panelClass]
    });
  }


  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level, node => node.expandable);
  
  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.child);
  
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
      this.treeControl.expandAll();
    });
  }
}

/** Flat node with expandable and level information */
interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}