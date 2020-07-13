import { Component, OnInit, Input } from '@angular/core';
import { MatDialogConfig, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { RequestFormComponent } from '../../domain/reports/request-form/request-form/request-form.component';
import { NavigationExtras, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  accessLevel: number = -1;
  fileNameDialogRef: MatDialogRef<RequestFormComponent>;


  constructor(private dialog: MatDialog, private router: Router, private snackBar : MatSnackBar) { }

  isShowTitle:boolean = true;

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
        if(result) {
          let navigationExtras: NavigationExtras = { state: { params: result } };
          this.openSnackBar('La requête a été envoyé', 'notif-success');
          this.router.navigate(['/reports'], navigationExtras);
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
