import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/components/domain/user/User';
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteUserComponent } from 'src/app/components/domain/user/delete-user/delete-user.component';
import { ModifyUserComponent } from 'src/app/components/domain/user/modify-user/modify-user.component';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  displayedColumns : string[];
  dataSource : User[];

  constructor(private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.refreshList();
  }

  // Ouvre une boîte dialogue pour modifier un utilisateur
  openEditDialog(user) {
    console.log(user);
    const dialogRef = this.dialog.open(ModifyUserComponent, {
      data: { 
        id: user.id, 
        firstName: user.firstName, 
        lastName: user.lastName, 
        email: user.email, 
        role: user.role 
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined) {
        this.openSnackBar('L\'utilisateur a été modifié!');
        this.refreshList();
      }
    });
  }

  // Ouvre une boîte dialogue pour supprimer un utilisateur
  openDeleteDialog(user) {
    const dialogRef = this.dialog.open(DeleteUserComponent, {
      data: { 
        id: user.id, 
        firstName: user.firstName, 
        lastName: user.lastName, 
        email: user.email, 
        role: user.role 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined) {
        this.userService.deleteUser(result);
        this.openSnackBar('L\'utilisateur a été supprimé!');
        this.refreshList();
      }
    });
  }

  openSnackBar(message) {
    this.snackBar.open(message, 'Fermer', {
      duration: 2000,
      horizontalPosition: "right",
      verticalPosition: "bottom",
    });
  }

  refreshList() {
    this.displayedColumns = ['firstName', 'lastName', 'email', 'role', 'operations'];
    this.dataSource = this.userService.getUsers();
    // this.userService.getAllUser().subscribe(users => {
    //   this.dataSource = users;
    // })
  }
}
