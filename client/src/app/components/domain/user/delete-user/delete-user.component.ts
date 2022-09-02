import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.css'],
})
export class DeleteUserComponent implements OnInit {
  isCurrentUser = false;

  canceledMessage = 'Canceled';

  constructor(public dialogRef: MatDialogRef<DeleteUserComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    if (localStorage.getItem('email') === this.data.email) {
      this.isCurrentUser = true;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
