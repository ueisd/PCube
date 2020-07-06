import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeleteUserComponent } from '../../user/delete-user/delete-user.component';

@Component({
  selector: 'app-delete-timeline',
  templateUrl: './delete-timeline.component.html',
  styleUrls: ['./delete-timeline.component.css']
})
export class DeleteTimelineComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DeleteUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any
    ) { }

  ngOnInit(): void {
  }

  onNoClick() : void {
    this.dialogRef.close();
  }

}
