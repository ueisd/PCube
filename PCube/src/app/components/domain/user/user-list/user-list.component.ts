import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/models/user';
import { MatDialog } from "@angular/material/dialog";
import { DeleteUserComponent } from 'src/app/components/domain/user/delete-user/delete-user.component';
import { ModifyUserComponent } from 'src/app/components/domain/user/modify-user/modify-user.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  displayedColumns : string[];
  dataSource : User[] = [];

  nameFilter = new FormControl('');
  lastNameFilter = new FormControl('');
  emailFilter = new FormControl('');
  roleFilter = new FormControl('');

  constructor(private userService: UserService,
    private dialog: MatDialog,
    private snackBar : MatSnackBar) { }

  ngOnInit(): void {
    this.refreshList();
  }

  onFilterChanged(){
    this.refreshList();
  }

  openEditDialog(user) {
    const dialogRef = this.dialog.open(ModifyUserComponent, {
      data: { 
        id: user.id, 
        firstName: user.first_name, 
        lastName: user.last_name, 
        email: user.email, 
        roleId: user.role_id,
        roleName: user.role_name 
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined) {
        this.openSnackBar('L\'utilisateur a été modifié!', 'notif-success');
        this.refreshList();
      }
    });
  }

  openDeleteDialog(user) {
    const dialogRef = this.dialog.open(DeleteUserComponent, {
      data: { 
        id: user.id, 
        firstName: user.first_name, 
        lastName: user.last_name, 
        email: user.email, 
        roleId: user.role_id,
        roleName: user.role_name
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined) {
        this.userService.deleteUser(result.id, result.email).subscribe((data) => {
          this.openSnackBar('L\'utilisateur a été supprimé!', 'notif-success');
          this.refreshList();
        },
        (error) => {
          this.openSnackBar('Une erreur s\'est produit. Veuillez réessayer', 'notif-error');
        });
      }
    });
  }

  openSnackBar(message, panelClass) {
    this.snackBar.open(message, 'Fermer', {
      duration: 2000,
      horizontalPosition: "right",
      verticalPosition: "bottom",
      panelClass: [panelClass]
    });
  }

  refreshList() {

    let user = new User();
    user.firstName = this.nameFilter.value.trim();
    user.lastName = this.lastNameFilter.value.trim();
    user.email = this.emailFilter.value.trim();
    user.roleName = this.roleFilter.value.trim();

    this.displayedColumns = ['firstName', 'lastName', 'email', 'role', 'operations'];
    this.userService.getUserByFilter(user).subscribe(users => {
      this.dataSource = users;
    });
  }

}
