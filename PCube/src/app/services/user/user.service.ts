import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  getUsers() {
    return "{[{first_name : Mitesh, last_name : Patel, email : test, role : admin}]}";
  }
}
