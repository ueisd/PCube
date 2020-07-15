import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/models/user';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { DeleteUserComponent } from 'src/app/components/domain/user/delete-user/delete-user.component';
import { ModifyUserComponent } from 'src/app/components/domain/user/modify-user/modify-user.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { CustomSnackBar } from 'src/app/utils/custom-snackbar';
import { MatPaginator } from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  displayedColumns : string[];
  dataSource = new MatTableDataSource<User>();

  nameFilter = new FormControl('');
  lastNameFilter = new FormControl('');
  emailFilter = new FormControl('');
  roleFilter = new FormControl('');

  customSnackBar:CustomSnackBar = new CustomSnackBar(this.snackBar)

  constructor(private userService: UserService,
    private dialog: MatDialog,
    private snackBar : MatSnackBar) { }

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  
  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
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
        this.customSnackBar.openSnackBar('L\'utilisateur a été modifié!', 'notif-success');
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
      },
      panelClass: 'warning-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined) {
        this.userService.deleteUser(result.id, result.email).subscribe((data) => {
          this.customSnackBar.openSnackBar('L\'utilisateur a été supprimé!', 'notif-success');
          this.refreshList();
        },
        (error) => {
          this.customSnackBar.openSnackBar('Une erreur s\'est produit. Veuillez réessayer', 'notif-error');
        });
      }
    });
  }

  refreshList() {

    let user = new User();
    user.first_name = this.nameFilter.value.trim();
    user.last_name = this.lastNameFilter.value.trim();
    user.email = this.emailFilter.value.trim();
    user.role_name = this.roleFilter.value.trim();

    this.displayedColumns = ['firstName', 'lastName', 'email', 'role', 'operations'];
    this.userService.getUserByFilter(user).subscribe(users => {
      this.dataSource = new MatTableDataSource<User>(users);
      this.dataSource.paginator = this.paginator;
    });
  }

}
