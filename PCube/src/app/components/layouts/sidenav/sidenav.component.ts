import { Component, OnInit, Input } from '@angular/core';
import { MatDialogConfig, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { RequestFormComponent } from '../../domain/reports/request-form/request-form/request-form.component';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  accessLevel: number = -1;
  fileNameDialogRef: MatDialogRef<RequestFormComponent>;

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openReportReqDialog() {
    const dialogConfig = new MatDialogConfig();
    /*dialogConfig.data = { 
      projet : new ProjectItem(),
    }*/
    dialogConfig.minWidth = 600;
    this.fileNameDialogRef = this.dialog.open(RequestFormComponent, dialogConfig);
    
    this.fileNameDialogRef.afterClosed().subscribe(result => { 
        if(result == true) {
          //alert("result true");
        }
      }
    );
  }

}
