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

  openEditDialog(user) {
    console.log(user);
  }

  openDeleteDialog(user) {
    console.log(user);
  }
}
