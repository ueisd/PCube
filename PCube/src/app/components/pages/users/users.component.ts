import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { UserListComponent } from 'src/app/components/domain/user/user-list/user-list.component';
import { AddUserComponent } from 'src/app/components/domain/user/add-user/add-user.component';
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { Utils } from 'src/app/components/domain/utils/utils';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  ngOnInit(): void {
  }
  
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    this.fileNameDialogRef = this.dialog.open(AddUserComponent, dialogConfig);

    this.fileNameDialogRef.afterClosed().subscribe(result => { 
        console.log(result);
        this.child.refreshList();
        if(result == true) {
          this.openSnackBar('L\'utilisateur a été créé!', 'notif-success');
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
