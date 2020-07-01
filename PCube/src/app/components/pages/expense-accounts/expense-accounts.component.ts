import { Component, OnInit } from '@angular/core';
import { ExpenseAccountListComponent } from 'src/app/components/domain/expense-account/expense-account-list/expense-account-list.component';
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-expense-accounts',
  templateUrl: './expense-accounts.component.html',
  styleUrls: ['./expense-accounts.component.css']
})
export class ExpenseAccountsComponent implements OnInit {

  constructor(private dialog: MatDialog,
    private snackBar : MatSnackBar) { }

  ngOnInit(): void {
  }

  openAddDialog() {
    this.openSnackBar('Le compte de dépense a été créé', 'notif-success');
  }

  openEditDialog() {
    this.openSnackBar('Le compte de dépense a été modifié', 'notif-success');
  }

  openDeleteDialog() {
    this.openSnackBar('Le compte de dépense a été supprimé', 'notif-success');
  }

  openSnackBar(message, panelClass) {
    this.snackBar.open(message, 'Fermer', {
      duration: 2000,
      horizontalPosition: "right",
      verticalPosition: "bottom",
      panelClass: [panelClass]
    });
  }
}
