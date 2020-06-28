import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivityService } from 'src/app/services/activity/activity.service';
import { ActivityListComponent } from 'src/app/components/domain/activity/activity-list/activity-list.component';
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { AddActivityComponent } from '../../domain/activity/add-activity/add-activity.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {

  @ViewChild(ActivityListComponent) child;

  fileNameDialogRef: MatDialogRef<AddActivityComponent>;

  constructor(private snackBar: MatSnackBar, private activityService: ActivityService, private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  /*askForDataRefresh($event){
    this.child.refreshList();
  }*/

  // Ouvre un boîte dialogue pour afficher une liste d'utilisateurs
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    this.fileNameDialogRef = this.dialog.open(AddActivityComponent, dialogConfig);
    this.fileNameDialogRef.afterClosed().subscribe(
      result => { 
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
