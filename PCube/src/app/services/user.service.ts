import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { env } from 'process';
import { Observable } from 'rxjs';
import { User } from '../components/pages/add-user/add-user.component';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  POST_USER_API = environment.api_url + '/api/user';
  constructor(private http : HttpClient) { }

  createUser(user:User) {
    console.log("ON est dans le create!!");
    console.log(this.POST_USER_API)
    this.http.post<User>(this.POST_USER_API, user ,{headers: {'Content-Type': 'application/json'}}).subscribe({
      error: error => console.error("There is an error!", error)
    })
  }
}
