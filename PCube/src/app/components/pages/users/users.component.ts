import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { UserListComponent } from 'src/app/components/domain/user/user-list/user-list.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  @ViewChild(UserListComponent) child;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

}
