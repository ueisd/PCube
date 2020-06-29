import { OnInit, Component, ViewChild, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { ExpenseAccountItem } from 'src/app/models/expense-account';
import { ExpenseAccountService } from 'src/app/services/expense-account/expense-account.service';
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-expense-account-list',
  templateUrl: './expense-account-list.component.html',
  styleUrls: ['./expense-account-list.component.css']
})
export class ExpenseAccountListComponent implements OnInit {
  displayedColumns : string[];
  dataSource : ExpenseAccountItem[] = [];

  constructor(private expenseAccountService: ExpenseAccountService,
    private dialog: MatDialog,
    private snackBar : MatSnackBar) { }

  ngOnInit(): void {
    this.refreshList();
  }

  openEditDialog(user) {
    this.openSnackBar('Le compte de dépense a été modifié!', 'notif-success');
  }

  openDeleteDialog(user) {
    this.openSnackBar('Le compte de dépense a été supprimé!', 'notif-success');
  }

  openSnackBar(message, panelClass) {
    this.snackBar.open(message, 'Fermer', {
      duration: 2000,
      horizontalPosition: "right",
      verticalPosition: "bottom",
      panelClass: [panelClass]
    });
  }

  refreshList() {
    this.displayedColumns = ['id', 'name', 'parentId', 'operations'];
    this.expenseAccountService.getAllExpenseAccount().subscribe(accounts => {
      this.dataSource = accounts;
    });
  }

}
