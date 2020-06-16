import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user//user.service';
import { User } from '../domain/user/User';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  displayedColumns : string[];
  dataSource : User[];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.displayedColumns = ['firstName', 'lastName', 'email', 'role', 'operations'];
    this.dataSource = this.userService.getUsers();
  }

  // Ouvre un boîte dialogue pour modifier un utilisateur
  openEditDialog(user) {
    console.log(user);
  }

  // Ouvre un boîte dialogue pour supprimer un utilisateur
  openDeleteDialog(user) {
    console.log(user);
  }
}
