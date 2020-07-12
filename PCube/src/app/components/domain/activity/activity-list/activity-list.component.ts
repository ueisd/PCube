import { Component, OnInit } from '@angular/core';
import { ActivityItem } from 'src/app/models/activity';
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { ActivityService } from 'src/app/services/activity/activity.service';
import * as $ from 'jquery/dist/jquery.min.js';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { Observable, } from 'rxjs';
import { DeleteActivityComponent } from '../delete-activity/delete-activity.component';
import { AddActivityComponent } from '../add-activity/add-activity.component';

const HIDDEN_CLASS = 'hidden';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.css']
})

export class ActivityListComponent implements OnInit {

  nameFilter = new FormControl('');

  constructor(private activityService: ActivityService, 
    private dialog: MatDialog, 
    private snackBar : MatSnackBar ) { }

  displayedColumns : string[];
  dataSource: ActivityItem[];

  ngOnInit(): void {
    this.refreshList();
  }

  onNameFilterChanged(){
    this.refreshList();
  }

  openDeleteDialog(activity) {
    const dialogRef = this.dialog.open(DeleteActivityComponent, {
      data: {
        id: activity.id,
        name: activity.name,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined) {
        this.activityService.deleteActivity(result.id).subscribe((data) => {
          this.openSnackBar('L\'activité a été supprimé!', 'notif-success');
          this.refreshList();
        },
        (error) => {
          this.openSnackBar('Une erreur s\'est produit. Veuillez réessayer', 'notif-error');
        });
      }
    });
  }

  openSnackBar(message, panelClass) {
    this.snackBar.open(message, 'Fermer', {
      duration: 10000,
      horizontalPosition: "right",
      verticalPosition: "bottom",
      panelClass: [panelClass]
    });
  }

  refreshList(){
    let activity = new ActivityItem();
    activity.name = this.nameFilter.value.trim();
    this.displayedColumns = ['name', 'operations'];
    this.activityService.filterActivity(activity).subscribe(activities => {
      this.dataSource = activities;
    });
  }

  isNewValueValid(newValue): boolean{
    if(newValue == null || newValue.trim().length == 0)
      return false;
    else
      return true;
  }

  fileNameDialogRef: MatDialogRef<AddActivityComponent>;

  openEditDialog(activity:ActivityItem) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { 
      activity : activity,
    }
    dialogConfig.minWidth = 600;
    this.fileNameDialogRef = this.dialog.open(AddActivityComponent, dialogConfig);
    
    this.fileNameDialogRef.afterClosed().subscribe(result => { 
        if(result == true) {
          this.refreshList();
          this.openSnackBar("L'activité a été modifiée", 'notif-success');
        }
      }
    );
  }

}
