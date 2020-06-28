import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { UserListComponent } from 'src/app/components/domain/user/user-list/user-list.component';
import { AddUserComponent } from 'src/app/components/domain/user/add-user/add-user.component';
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from '@angular/material/snack-bar';
import { Utils } from 'src/app/components/domain/utils/utils';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  @ViewChild(UserListComponent) child;
  fileNameDialogRef: MatDialogRef<AddUserComponent>;

  constructor(private userService: UserService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog) { }

  ngOnInit(): void {
  }
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    this.fileNameDialogRef = this.dialog.open(AddUserComponent, dialogConfig);
    this.fileNameDialogRef.afterClosed().subscribe(
      result => { 
        console.log(result);
        this.child.refreshList();
        if(result == true) {
          Utils.openSnackBar('L\'utilisateur a été créé!', 'notif-success');
          Utils.openSnackBar('L\'utilisateur a été créé!', 'notif-error');
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
