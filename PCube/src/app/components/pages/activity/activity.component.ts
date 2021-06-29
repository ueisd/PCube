import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivityService } from 'src/app/services/activity/activity.service';
import { ActivityListComponent } from 'src/app/components/domain/activity/activity-list/activity-list.component';
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { AddActivityComponent } from 'src/app/components/domain/activity/add-activity/add-activity.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackBar } from 'src/app/utils/custom-snackbar';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {

  fileNameDialogRef: MatDialogRef<AddActivityComponent>;
  @ViewChild(ActivityListComponent) child;

  customSnackBar: CustomSnackBar = new CustomSnackBar(this.snackBar)

  constructor(private activityService: ActivityService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  async openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minWidth = 600;
    this.fileNameDialogRef = this.dialog.open(AddActivityComponent, dialogConfig);

    let result = await this.fileNameDialogRef.afterClosed().toPromise();
    if (result == "Canceled" || result == undefined) {
      this.customSnackBar.openSnackBar('Action annulée', 'notif-warning');
    } else if (result) {
      this.customSnackBar.openSnackBar('L\'activité a été créée', 'notif-success');
      this.child.refreshList();   
    }
  }
}
