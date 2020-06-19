import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/components/domain/user/User';
import { Observable } from 'rxjs';

const API_ALL_USER = environment.api_url + "/api/user";
const API_DELETE_USER = environment.api_url + "/api/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers() {
    let response = "{ \"users\" : [{\"first_name\" : \"Mitesh\", \"last_name\" : \"Patel\", \"email\" : \"test@test.com\", \"role\" : \"admin\"},{\"first_name\" : \"George\", \"last_name\" : \"Smith\", \"email\" : \"test2@test.com\", \"role\" : \"member\"}]}"; 
    let json = JSON.parse(response)
    let users : User[] = [];

    json.users.forEach(user => {
      users.push(new User(user))
    });

    return users;
  }

  getAllUser():Observable<User[]> {
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')  // tslint:disable-line:object-literal-key-quotes
      })
    };
    
    return this.http.get<User[]>(API_ALL_USER, opts);
  }

  deleteUser(user) {
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')  // tslint:disable-line:object-literal-key-quotes
      })
    };
    
    return this.http.delete<User>(API_DELETE_USER, opts);
  }
}
