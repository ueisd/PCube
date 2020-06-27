import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/components/domain/user/User';
import { Observable } from 'rxjs';

const API_ALL_USER = environment.api_url + "/api/user";
const API_IS_UNIQUE = environment.api_url + "/api/user/is-unique-email";
const API_USER = environment.api_url + "/api/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers() {
    let response = "{ \"users\" : [{\"id\" : 1, \"first_name\" : \"Mitesh\", \"last_name\" : \"Patel\", \"email\" : \"test@test.com\", \"role\" : { \"id\" : 1, \"role_name\" : \"admin\"}},{\"id\" : 2, \"first_name\" : \"George\", \"last_name\" : \"Smith\", \"email\" : \"test2@test.com\", \"role\" : { \"id\" : 3, \"role_name\" : \"member\"}}]}"; 
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
    
    return this.http.delete<User>(API_USER, opts);
  }

  isEmailUnique(email): Observable<boolean> {

    var url = API_IS_UNIQUE + "/" + email
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')  // tslint:disable-line:object-literal-key-quotes
      })
    };
    return this.http.get<boolean>(url, opts);
  }

  modifyUser(id, email, firstName, lastName, newEmail, roleId) {
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),  // tslint:disable-line:object-literal-key-quotes
        'Content-Type': 'application/json'
      })
    };

    let body = {
      id: id,
      email: email,
      first_name: firstName,
      last_name: lastName,
      new_email: newEmail,
      role_id: roleId
    } 
    
    return this.http.put<User>(API_USER, body, opts);
  }
}
