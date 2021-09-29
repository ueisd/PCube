import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { UserListComponent } from 'src/app/components/domain/user/user-list/user-list.component';
import { AddUserComponent } from 'src/app/components/domain/user/add-user/add-user.component';
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackBar } from 'src/app/utils/custom-snackbar';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  fileNameDialogRef: MatDialogRef<AddUserComponent>;
  @ViewChild(UserListComponent) child;

  constructor(private userService: UserService,
    private dialog: MatDialog,
    private snackBar : MatSnackBar) { }

  customSnackBar:CustomSnackBar = new CustomSnackBar(this.snackBar);

  ngOnInit(): void {
  }
  
  async openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "500px";
    this.fileNameDialogRef = this.dialog.open(AddUserComponent, dialogConfig);

    let result = await this.fileNameDialogRef.afterClosed().toPromise();
    if(result == "Canceled" || result == undefined){
      this.customSnackBar.openSnackBar('Action annulée', 'notif-warning');
    }else if(result) {
      this.child.addUserToTable(result);
      this.customSnackBar.openSnackBar('L\'utilisateur a été créé!', 'notif-success');
    }
  }



}
