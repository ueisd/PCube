import { OnInit, Component } from '@angular/core';
import { ExpenseAccountItem } from 'src/app/models/expense-account';
import { ExpenseAccountService } from 'src/app/services/expense-account/expense-account.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { MatDialogConfig, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddExpenseAccountComponent } from '../add-expense-account/add-expense-account.component';
import { DeleteExpenseAccountComponent } from 'src/app/components/domain/expense-account/delete-expense-account/delete-expense-account.component';
import { CustomSnackBar } from 'src/app/utils/custom-snackbar';
import { DataTreeFetcher } from 'src/app/models/utils/DataTreeFetcher';

@Component({
  selector: 'app-expense-account-list',
  templateUrl: './expense-account-list.component.html',
  styleUrls: ['./expense-account-list.component.css'],
})
export class ExpenseAccountListComponent implements OnInit {
  fileNameDialogRef: MatDialogRef<AddExpenseAccountComponent>;
  isDeletable = true;

  constructor(private expenseAccountService: ExpenseAccountService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  customSnackBar: CustomSnackBar = new CustomSnackBar(this.snackBar);

  treeControl = new FlatTreeControl<FlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.child
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  ngOnInit(): void {
    this.refreshList({ expanded: true });
  }

  private _transformer(node: ExpenseAccountItem, level: number) {
    const expensenoChild: ExpenseAccountItem = new ExpenseAccountItem(node);
    expensenoChild.child = [];
    return {
      expandable: !!node.child && node.child.length > 0,
      id: node.id,
      name: node.name,
      level,
      parent_id: node.parent_id,
      expenseAcount: expensenoChild,
      nbLignesDeTemps: node.nbLignesDeTemps,
      nbChild: node.child.length,
    };
  }

  async openEditDialog(compte: ExpenseAccountItem) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      expenseAccount: compte,
    };
    dialogConfig.minWidth = 600;
    this.fileNameDialogRef = this.dialog.open(AddExpenseAccountComponent, dialogConfig);

    const result = await this.fileNameDialogRef.afterClosed().toPromise();
    if (result === 'Canceled' || result === undefined) {
      this.customSnackBar.openSnackBar('Action annulée', 'notif-warning');
    } else if (result) {
      await this.refreshList({ expanded: true });
      this.customSnackBar.openSnackBar(`Le compte de dépense ${result.name} a été modifié`, 'notif-success');
    }
  }

  async openDeleteDialog(expenseAccount: ExpenseAccountItem) {
    this.isDeletable = await this.expenseAccountService.isExpenseAccountDeletable(expenseAccount.id).toPromise();
    const dialogConfig = this.dialog.open(DeleteExpenseAccountComponent, {
      data: {
        id: expenseAccount.id,
        name: expenseAccount.name,
        isDeletable: this.isDeletable,
      },
      panelClass: 'warning-dialog',
    });
    const result = await dialogConfig.afterClosed().toPromise();
    if (result !== undefined) {
      try {
        await this.expenseAccountService.deleteExpenseAccount(expenseAccount.id).toPromise();
        this.customSnackBar.openSnackBar(`Le compte de dépense ${expenseAccount.name} a été supprimé`, 'notif-success');
        this.refreshList({ expanded: true });
      } catch (err) {
        this.customSnackBar.openSnackBar(`${err.error.name} - ${err.error.message} `, 'notif-error');
      }
    }
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  async refreshList(opts?: refreshOption) {
    const expensesAccounts = await this.expenseAccountService.getAllExpenseAccount().toPromise();
    const expensesAccountsTree = DataTreeFetcher.fetchProjectTree({
      itemList: expensesAccounts,
      fieldsNames: {
        childs: 'child',
        id: 'id',
        parentId: 'parent_id',
      },
    });
    this.dataSource.data = expensesAccountsTree;
    if (opts.expanded) {
      this.treeControl.expandAll();
    }
  }
}

// tslint:disable-next-line:class-name
interface refreshOption {
  expanded: boolean;
}

/** Flat node with expandable and level information */
interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}
