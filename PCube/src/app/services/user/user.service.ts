import { Injectable } from '@angular/core';
import { User } from 'src/app/components/domain/user/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  getUsers() {
    let response = "{ \"users\" : [{\"first_name\" : \"Mitesh\", \"last_name\" : \"Patel\", \"email\" : \"test@test.com\", \"role\" : \"admin\"},{\"first_name\" : \"George\", \"last_name\" : \"Smith\", \"email\" : \"test2@test.com\", \"role\" : \"member\"}]}"; 
    let json = JSON.parse(response)
    let users : User[] = [];

    json.users.forEach(user => {
      users.push(new User(user))
    });

    return users;
  }
}
