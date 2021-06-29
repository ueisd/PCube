import { Component, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { RequestFormComponent } from '../../domain/reports/request-form/request-form/request-form.component';
import { NavigationExtras, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  accessLevel: number = -1;
  fileNameDialogRef: MatDialogRef<RequestFormComponent>;
  user: User = new User();

  constructor(private dialog: MatDialog, private router: Router, private snackBar : MatSnackBar) { }

  isShowTitle:boolean = true;

  ngOnInit(): void {}

  async openReportReqDialog(type) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { 
      user : this.user,
      type : type
    }
    dialogConfig.minWidth = 600;
    this.fileNameDialogRef = this.dialog.open(RequestFormComponent, dialogConfig);
    
    let result = await this.fileNameDialogRef.afterClosed().toPromise();
    if(result) {
      let navigationExtras: NavigationExtras = { state: { params: result } };
      this.openSnackBar('La requête a été envoyé', 'notif-success');

      if(type == 'rapport')
        this.router.navigate(['/rapport'], navigationExtras);
      else if(type == 'temps')
        this.router.navigate(['/gestion-des-lignes-de-temps'], navigationExtras);
    }
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
