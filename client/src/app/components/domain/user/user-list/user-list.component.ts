import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/models/user';
import { MatDialog } from '@angular/material/dialog';
import { DeleteUserComponent } from 'src/app/components/domain/user/delete-user/delete-user.component';
import { ModifyUserComponent } from 'src/app/components/domain/user/modify-user/modify-user.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { CustomSnackBar } from 'src/app/utils/custom-snackbar';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  displayedColumns: string[];
  dataSource = new MatTableDataSource<User>();
  userList: User[];

  nameFilter = new FormControl('');
  lastNameFilter = new FormControl('');
  emailFilter = new FormControl('');
  roleFilter = new FormControl('');

  customSnackBar: CustomSnackBar = new CustomSnackBar(this.snackBar);

  constructor(private userService: UserService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.userService
      .getAllUser()
      .toPromise()
      .then((users) => {
        this.userList = users;
        this.displayedColumns = ['firstName', 'lastName', 'email', 'role', 'operations'];
        this.dataSource = new MatTableDataSource<User>(users);
        this.dataSource.paginator = this.paginator;
      })
      .catch((err) => {
        // TODO Gérer l'erreur (PLM)
        console.log(err);
      });
  }

  filterListFromUserFilter(user: User, userList): User[] {
    const regex = {
      firstName: new RegExp('^' + user.firstName + '', 'i'),
      lastName: new RegExp('^' + user.lastName + '', 'i'),
      email: new RegExp('^' + user.email + '', 'i'),
      role_name: new RegExp('^' + user.role.name + '', 'i'),
    };

    return userList.filter((u) => {
      return regex.firstName.test(u.firstName) && regex.lastName.test(u.lastName) && regex.email.test(u.email) && regex.role_name.test(u.role.name);
    });
  }

  resetFilters() {
    this.nameFilter.setValue('');
    this.lastNameFilter.setValue('');
    this.emailFilter.setValue('');
    this.roleFilter.setValue('');
  }

  getUserFilterFromForm(): User {
    const user = new User();
    user.firstName = this.nameFilter.value.trim();
    user.lastName = this.lastNameFilter.value.trim();
    user.email = this.emailFilter.value.trim();
    user.role.name = this.roleFilter.value.trim();
    return user;
  }

  onFilterChanged() {
    const userFilter = this.getUserFilterFromForm();
    const filteredUsers = this.filterListFromUserFilter(userFilter, this.userList);

    this.dataSource = new MatTableDataSource<User>(filteredUsers);
    this.dataSource.paginator = this.paginator;
  }

  async openEditDialog(user: User) {
    const dialogRef = this.dialog.open(ModifyUserComponent, {
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roleId: user.role.id,
        roleName: user.role.name,
      },
    });

    const result = await dialogRef.afterClosed().toPromise();
    if (result === 'Canceled' || result === undefined) {
      this.customSnackBar.openSnackBar('Action annulée', 'notif-warning');
    } else {
      this.customSnackBar.openSnackBar(`L'utilisateur a été modifié!`, 'notif-success');
      await this.refreshList();
    }
  }

  async openDeleteDialog(user: User) {
    const dialogRef = this.dialog.open(DeleteUserComponent, {
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roleId: user.role.id,
        roleName: user.role.name,
      },
      panelClass: 'warning-dialog',
    });

    const result = await dialogRef.afterClosed().toPromise();
    if (result === 'Canceled' || result === undefined) {
      this.customSnackBar.openSnackBar('Action annulée', 'notif-warning');
    } else {
      try {
        await this.userService.deleteUser(result.id).toPromise();
        this.customSnackBar.openSnackBar(`L'utilisateur a été supprimé!`, 'notif-success');
        await this.refreshList();
      } catch (err) {
        this.customSnackBar.openSnackBar(`${err.error.name} - ${err.error.message} `, 'notif-error');
      }
    }
  }

  addUserToTable(user: User) {
    this.userList.unshift(user);
    this.dataSource.data = this.userList;
    this.dataSource._updateChangeSubscription();
    this.resetFilters();
  }

  async refreshList() {
    this.userList = await this.userService.getAllUser().toPromise();
    const userFilter = this.getUserFilterFromForm();
    const filteredUsers = this.filterListFromUserFilter(userFilter, this.userList);
    this.dataSource = new MatTableDataSource<User>(filteredUsers);
    this.dataSource.paginator = this.paginator;
  }
}
