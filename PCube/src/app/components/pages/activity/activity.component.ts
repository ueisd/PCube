import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivityService } from 'src/app/services/activity/activity.service';
import { ActivityListComponent } from 'src/app/components/domain/activity/activity-list/activity-list.component';
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { AddActivityComponent } from 'src/app/components/domain/activity/add-activity/add-activity.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {

  fileNameDialogRef: MatDialogRef<AddActivityComponent>;
  @ViewChild(ActivityListComponent) child;

  constructor(private activityService: ActivityService, 
    private dialog: MatDialog,
    private snackBar : MatSnackBar) { }

  ngOnInit(): void {
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minWidth = 600;
    this.fileNameDialogRef = this.dialog.open(AddActivityComponent, dialogConfig);
    
    this.fileNameDialogRef.afterClosed().subscribe(result => { 
        if(result == true) {
          this.child.refreshList();
          this.openSnackBar('L\'activité a été créée', 'notif-success');
        }
      }
    );
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
