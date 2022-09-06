import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackBar } from 'src/app/utils/custom-snackbar';

@Component({
  selector: 'app-delete-project',
  templateUrl: './delete-project.component.html',
  styleUrls: ['./delete-project.component.css'],
})
export class DeleteProjectComponent implements OnInit {
  canceledMessage = 'Canceled';

  constructor(public dialogRef: MatDialogRef<DeleteProjectComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private snackBar: MatSnackBar) {}

  customSnackBar: CustomSnackBar = new CustomSnackBar(this.snackBar);

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
