import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from 'src/app/Model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  POST_USER_API = '/api/auth/user';
  private jwt: JwtHelperService = new JwtHelperService();

 
  constructor(private http : HttpClient) {
   }

  createUser(user:User) {
    console.log("ON est dans le create!!");
    console.log(this.POST_USER_API);
    this.http.post<User>(this.POST_USER_API, {User}).subscribe({
      error: error => console.error("There is an error!", error)
    })
  }
}
