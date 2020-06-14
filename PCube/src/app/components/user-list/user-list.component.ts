import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user//user.service';

class User {
  fname : string;
  lname : string;
  email : string;
  role : string;
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  //private users : User[];
  test : string;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.test = this.userService.getUsers();
    //const list = this.userService.getUsers();
  }

}
