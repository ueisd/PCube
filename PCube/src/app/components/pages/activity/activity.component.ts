import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivityService } from 'src/app/services/activity/activity.service';
import { ActivityListComponent } from 'src/app/components/domain/activity/activity-list/activity-list.component';
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { AddActivityComponent } from 'src/app/components/domain/activity/add-activity/add-activity.component';
import { Utils } from 'src/app/components/domain/utils/utils';
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
    this.fileNameDialogRef = this.dialog.open(AddActivityComponent, dialogConfig);
    
    this.fileNameDialogRef.afterClosed().subscribe(result => { 
        console.log(result);
        this.child.refreshList();
        if(result == true) {
          this.openSnackBar('L\'activité a été créée', 'notif-success');
        }
      }
    );
  }

  openSnackBar(message, panelClass) {
    this.snackBar.open(message, 'Fermer', {
      duration: 2000,
      horizontalPosition: "right",
      verticalPosition: "bottom",
      panelClass: [panelClass]
    });
  }

}
