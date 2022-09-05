import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivityItem } from 'src/app/models/activity';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivityService } from 'src/app/services/activity/activity.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { DeleteActivityComponent } from '../delete-activity/delete-activity.component';
import { AddActivityComponent } from '../add-activity/add-activity.component';
import { CustomDiaglogConfig } from 'src/app/utils/custom-dialog-config';
import { CustomSnackBar } from 'src/app/utils/custom-snackbar';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.css'],
})
export class ActivityListComponent implements OnInit {
  nameFilter = new FormControl('');

  constructor(private activityService: ActivityService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  displayedColumns: string[];
  activitys: ActivityItem[];
  dataSource = new MatTableDataSource<ActivityItem>();

  customDiagConfig: CustomDiaglogConfig = new CustomDiaglogConfig();
  customSnackBar: CustomSnackBar = new CustomSnackBar(this.snackBar);

  isViewInitDone = false;

  fileNameDialogRef: MatDialogRef<AddActivityComponent>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ngOnInit(): void {
    this.displayedColumns = ['name', 'operations'];
    this.dataSource.paginator = this.paginator;
    this.refreshList();
  }

  ngAfterViewInit() {
    this.isViewInitDone = true;
  }

  filterListFromActivityFilter(activity: ActivityItem, activityList): ActivityItem[] {
    const regexs = {
      name: new RegExp('^' + activity.name + '', 'i'),
    };

    return activityList.filter((u) => {
      return regexs.name.test(u.name);
    });
  }

  onNameFilterChanged() {
    const activity = new ActivityItem();
    activity.name = this.nameFilter.value.trim();
    const filteredActivitys = this.filterListFromActivityFilter(activity, this.activitys);
    this.dataSource = new MatTableDataSource<ActivityItem>(filteredActivitys);
    this.dataSource.paginator = this.paginator;
  }

  async openDeleteDialog(activity) {
    const dialogRef = this.dialog.open(DeleteActivityComponent, {
      data: {
        id: activity.id,
        name: activity.name,
      },
      panelClass: 'warning-dialog',
    });

    const result = await dialogRef.afterClosed().toPromise();

    if (result && result !== 'Canceled') {
      try {
        await this.activityService.deleteActivity(result.id).toPromise();
        this.customSnackBar.openSnackBar(`L'activité ${activity.name} a été supprimé!`, 'notif-success');
        await this.refreshList();
      } catch (err) {
        this.customSnackBar.openSnackBar(`${err.error.name} - ${err.error.message} `, 'notif-error');
      }
    }
  }

  async refreshList() {
    this.activitys = await this.activityService.getAllActivity().toPromise();
    this.dataSource = new MatTableDataSource<ActivityItem>(this.activitys);
    this.dataSource.paginator = this.paginator;
  }

  async openEditDialog(activity: ActivityItem) {
    this.customDiagConfig.config.data = { activity };

    this.fileNameDialogRef = this.dialog.open(AddActivityComponent, this.customDiagConfig.getDefaultConfig());

    const result = await this.fileNameDialogRef.afterClosed().toPromise();
    if (result === undefined || result === 'Canceled') {
      this.customSnackBar.openSnackBar('Action annulée', 'notif-warning');
    } else if (result) {
      this.refreshList();
      this.customSnackBar.openSnackBar(`L'activité a été modifiée`, 'notif-success');
    }
  }
}
