import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef , MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.css']
})
export class DeleteUserComponent implements OnInit {

  isDeletable: boolean = true;

  constructor(public dialogRef: MatDialogRef<DeleteUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    if(localStorage.getItem('email') === this.data.email)
      this.isDeletable = false;
  }

  onNoClick() : void {
    this.dialogRef.close();
  }
}
