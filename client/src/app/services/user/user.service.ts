import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/user';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const API_ALL_USER = environment.api_url + "/api/api/user";
const API_IS_UNIQUE = environment.api_url + "api/api/user/emailUnique";
const API_USER = environment.api_url + "api/api/user";
const API_GET_PROFIL = environment.api_url + "/api/user/profil";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUser(user:User): Observable<User> {

    let url = API_GET_PROFIL + "?email=" + user.email;
    url += "&id=" + user.id;

    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')  // tslint:disable-line:object-literal-key-quotes
      })
    };
    
    return this.http.get<User>(url, opts);
  }

  getAllUser():Observable<User[]> {
    return this.http.get<User[]>(API_ALL_USER).pipe(
      map(users => users.map(response => 
        new User(response)
      ))
    );
  }

  deleteUser(id): Observable<{}> {
    return this.http.delete(API_USER + "/" + id);
  }

  isEmailUnique(email): Observable<boolean> {
    var url = API_IS_UNIQUE + "/" + email
    return this.http.get<boolean>(url);
  }

  modifyUser(id, email, firstName, lastName, roleId : number) {
    return this.http.put<User>(API_USER, {
      id: id,
      email: email,
      firstName: firstName,
      lastName: lastName,
      RoleId: roleId
    });
  }

  createUser(user: User, pwd): Observable<User> {
    return this.http.post<User>(API_USER, {
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      RoleId: user.role_id,
      roleName: user.role_name,
      password: pwd
    });
  }
}
