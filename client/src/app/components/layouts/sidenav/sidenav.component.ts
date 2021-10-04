import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { RequestFormComponent } from '../../domain/reports/request-form/request-form/request-form.component';
import { NavigationExtras, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/models/user';
import { CurentUserService } from 'src/app/shared/services/curent-user.service';
import { Subscription } from 'rxjs';
import { CurentUser } from 'src/app/shared/models/curent-user.model';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit, OnDestroy {

  accessLevel: number = -1;
  fileNameDialogRef: MatDialogRef<RequestFormComponent>;
  isShowTitle:boolean = true;
  
  curentUserSubscription : Subscription = this.curentUserService.curentUser.subscribe(curent => {
    let user = curent.user;
    this.accessLevel = this.getAccesLevelFromUser(user);
  });

  constructor(
    private dialog: MatDialog, 
    private router: Router, 
    private snackBar : MatSnackBar,
    private curentUserService : CurentUserService
  ) { }

  private getAccesLevelFromUser(user: User): number {
    if(!user) return 0;
    return user.role.access_level;
  }

  ngOnInit(): void {
    let user = this.curentUserService.curentUser.value.user;
    this.accessLevel = this.getAccesLevelFromUser(user);
  }

  async openReportReqDialog(type) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { 
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

  ngOnDestroy() {
    this.curentUserSubscription.unsubscribe();
  }

}
