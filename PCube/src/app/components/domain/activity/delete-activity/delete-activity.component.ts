import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef , MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivityItem } from 'src/app/models/activity';

@Component({
  selector: 'app-delete-activity',
  templateUrl: './delete-activity.component.html',
  styleUrls: ['./delete-activity.component.css']
})
export class DeleteActivityComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DeleteActivityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ActivityItem
    ) { }

  ngOnInit(): void {
  }

  onNoClick() : void {
    this.dialogRef.close();
  }
}
