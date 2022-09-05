import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectListComponent } from 'src/app/components/domain/project/project-list/project-list.component';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AddProjectComponent } from 'src/app/components/domain/project/add-project/add-project.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectItem } from 'src/app/models/project';
import { CustomSnackBar } from 'src/app/utils/custom-snackbar';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
})
export class ProjectComponent implements OnInit {
  constructor(private dialog: MatDialog, private snackBar: MatSnackBar) {}

  customSnackBar: CustomSnackBar = new CustomSnackBar(this.snackBar);
  fileNameDialogRef: MatDialogRef<AddProjectComponent>;

  @ViewChild(ProjectListComponent) projectListChild;

  ngOnInit(): void {}

  async openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      projet: new ProjectItem(),
    };
    dialogConfig.minWidth = 600;
    this.fileNameDialogRef = this.dialog.open(AddProjectComponent, dialogConfig);

    const result = await this.fileNameDialogRef.afterClosed().toPromise();
    if (result === 'Canceled' || result === undefined) {
      this.customSnackBar.openSnackBar('Action annulée', 'notif-warning');
    } else if (result) {
      this.customSnackBar.openSnackBar(`Le projet ${result.name} a été créé`, 'notif-success');
      this.projectListChild.refreshList({ expanded: true });
    }
  }
}
