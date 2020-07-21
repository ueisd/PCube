import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivityItem } from 'src/app/models/activity';
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { ActivityService } from 'src/app/services/activity/activity.service';
import * as $ from 'jquery/dist/jquery.min.js';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { Observable, } from 'rxjs';
import { DeleteActivityComponent } from '../delete-activity/delete-activity.component';
import { AddActivityComponent } from '../add-activity/add-activity.component';
import { CustomDiaglogConfig } from 'src/app/utils/custom-dialog-config';
import { CustomSnackBar } from 'src/app/utils/custom-snackbar';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

const HIDDEN_CLASS = 'hidden';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.css']
})

export class ActivityListComponent implements OnInit {

  nameFilter = new FormControl('');

  constructor(
    private activityService: ActivityService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) { }

  displayedColumns: string[];
  dataSource = new MatTableDataSource<ActivityItem>();

  customDiagConfig: CustomDiaglogConfig = new CustomDiaglogConfig();
  customSnackBar: CustomSnackBar = new CustomSnackBar(this.snackBar);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.refreshList();
  }

  isViewInitDone: boolean = false;

  ngAfterViewInit() {
    this.isViewInitDone = true;
  }

  onNameFilterChanged() {
    this.refreshList();
  }

  openDeleteDialog(activity) {
    const dialogRef = this.dialog.open(DeleteActivityComponent, {
      data: {
        id: activity.id,
        name: activity.name,
      },
      panelClass: 'warning-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result == undefined || result == "Canceled") {
        this.customSnackBar.openSnackBar('Action annulée', 'notif-warning');
      } else if (result !== undefined) {
        this.activityService.deleteActivity(result.id).subscribe((data) => {
          this.customSnackBar.openSnackBar('L\'activité a été supprimé!', 'notif-success');
          this.refreshList();
        },
          (error) => {
            this.customSnackBar.openSnackBar('Une erreur s\'est produit. Veuillez réessayer', 'notif-error');
          });
      }
    });
  }

  refreshList() {
    let activity = new ActivityItem();
    activity.name = this.nameFilter.value.trim();
    this.displayedColumns = ['name', 'operations'];
    this.activityService.filterActivity(activity).subscribe(activities => {
      this.dataSource = new MatTableDataSource<ActivityItem>(activities);
      this.dataSource.paginator = this.paginator;
    });
  }

  isNewValueValid(newValue): boolean {
    if (newValue == null || newValue.trim().length == 0)
      return false;
    else
      return true;
  }

  fileNameDialogRef: MatDialogRef<AddActivityComponent>;

  openEditDialog(activity: ActivityItem) {

    this.customDiagConfig.config.data = {
      activity: activity,
    }

    this.fileNameDialogRef = this.dialog.open(AddActivityComponent, this.customDiagConfig.getDefaultConfig());

    this.fileNameDialogRef.afterClosed().subscribe(result => {

      if (result == undefined || result == "Canceled") {
        this.customSnackBar.openSnackBar('Action annulée', 'notif-warning');
      } else if (result) {
        this.refreshList();
        this.customSnackBar.openSnackBar("L'activité a été modifiée", 'notif-success');
      }
    });
  }

}
