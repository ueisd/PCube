import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/components/domain/user/User';
import { MatDialog } from "@angular/material/dialog";
import { DeleteUserComponent } from 'src/app/components/domain/user/delete-user/delete-user.component';
import { ModifyUserComponent } from 'src/app/components/domain/user/modify-user/modify-user.component';
import { Utils } from 'src/app/components/domain/utils/utils';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  displayedColumns : string[];
  dataSource : User[] = [];

  constructor(private userService: UserService,
    private dialog: MatDialog,
    private snackBar : MatSnackBar) { }

  ngOnInit(): void {
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
        },
        (error) => {
          this.openSnackBar('Une erreur s\'est produit. Veuillez réessayer', 'notif-error');
        });
        
        this.refreshList();
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
    this.displayedColumns = ['firstName', 'lastName', 'email', 'role', 'operations'];
    this.userService.getAllUser().subscribe(users => {
      this.dataSource = users;
    });
  }

}
