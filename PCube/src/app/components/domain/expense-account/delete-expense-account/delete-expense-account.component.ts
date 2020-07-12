import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-expense-account',
  templateUrl: './delete-expense-account.component.html',
  styleUrls: ['./delete-expense-account.component.css']
})
export class DeleteExpenseAccountComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DeleteExpenseAccountComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private snackBar : MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  onNoClick() : void {
    this.dialogRef.close();
    this.openSnackBar("L'action a été annulé.", 'notif-success');
  }

  openSnackBar(message, panelClass) {
    this.snackBar.open(message, 'Fermer', {
      duration: 10000,
      horizontalPosition: "right",
      verticalPosition: "bottom",
      panelClass: [panelClass]
    });
  }
}
