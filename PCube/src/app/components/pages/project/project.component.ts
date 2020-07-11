import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectListComponent } from 'src/app/components/domain/project/project-list/project-list.component';
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { AddProjectComponent } from 'src/app/components/domain/project/add-project/add-project.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectItem } from 'src/app/models/project';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private snackBar : MatSnackBar
    ){}

  ngOnInit(): void {}

  fileNameDialogRef: MatDialogRef<AddProjectComponent>;
  @ViewChild(ProjectListComponent) projectListChild;

  openDialog() {
    
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { 
      projet : new ProjectItem(),
    }
    dialogConfig.minWidth = 600;
    this.fileNameDialogRef = this.dialog.open(AddProjectComponent, dialogConfig);
    
    this.fileNameDialogRef.afterClosed().subscribe(result => { 
        if(result == true) {
          this.projectListChild.refreshList({expanded: true});
          this.openSnackBar('Le projet a été créée', 'notif-success');
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
