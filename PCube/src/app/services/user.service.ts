import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserForm } from 'src/app/Model/user-form';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  POST_USER_API = '/api/auth/user';
 
  constructor(private http : HttpClient) {
   }

  createUser(user:UserForm) {
    this.http.post<UserForm>(this.POST_USER_API, user).subscribe({
      error: error => console.error("There is an error!", error)
    })
  }
}
