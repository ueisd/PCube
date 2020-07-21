import { Component, OnInit, ViewChild } from '@angular/core';
import { ExpenseAccountListComponent } from 'src/app/components/domain/expense-account/expense-account-list/expense-account-list.component';
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AddExpenseAccountComponent } from '../../domain/expense-account/add-expense-account/add-expense-account.component';
import { ExpenseAccountItem } from 'src/app/models/expense-account';
import { CustomSnackBar } from 'src/app/utils/custom-snackbar';

@Component({
  selector: 'app-expense-accounts',
  templateUrl: './expense-accounts.component.html',
  styleUrls: ['./expense-accounts.component.css']
})
export class ExpenseAccountsComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  customSnackBar: CustomSnackBar = new CustomSnackBar(this.snackBar)

  ngOnInit(): void {
  }
  fileNameDialogRef: MatDialogRef<AddExpenseAccountComponent>;
  @ViewChild(ExpenseAccountListComponent) expenseAccountListChild;

  openAddDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minWidth = 600;
    dialogConfig.data = {
      expenseAccount: new ExpenseAccountItem(),
    }
    this.fileNameDialogRef = this.dialog.open(AddExpenseAccountComponent, dialogConfig);

    this.fileNameDialogRef.afterClosed().subscribe(result => {
      if (result == "Canceled" || result == undefined) {
        this.customSnackBar.openSnackBar('Action annulée', 'notif-warning');
      } else if (result) {
        this.expenseAccountListChild.refreshList({ expanded: true });
        this.customSnackBar.openSnackBar('Le compte de dépense a été créée', 'notif-success');
      }
    });
  }
}
