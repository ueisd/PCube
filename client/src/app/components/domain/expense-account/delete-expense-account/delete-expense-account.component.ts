import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackBar } from 'src/app/utils/custom-snackbar';

@Component({
  selector: 'app-delete-expense-account',
  templateUrl: './delete-expense-account.component.html',
  styleUrls: ['./delete-expense-account.component.css'],
})
export class DeleteExpenseAccountComponent implements OnInit {
  canceledMessage = 'Canceled';

  constructor(public dialogRef: MatDialogRef<DeleteExpenseAccountComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private snackBar: MatSnackBar) {}

  customSnackBar: CustomSnackBar = new CustomSnackBar(this.snackBar);

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
