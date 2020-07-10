import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-project',
  templateUrl: './delete-project.component.html',
  styleUrls: ['./delete-project.component.css']
})
export class DeleteProjectComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DeleteProjectComponent>,
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
