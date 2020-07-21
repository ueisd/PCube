import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-timeline',
  templateUrl: './delete-timeline.component.html',
  styleUrls: ['./delete-timeline.component.css']
})
export class DeleteTimelineComponent implements OnInit {

  canceledMessage = "Canceled";

  constructor(
    public dialogRef: MatDialogRef<DeleteTimelineComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    ) { }

  ngOnInit(): void {
  }
}
