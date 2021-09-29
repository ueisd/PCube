import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/user';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const API_ALL_USER = environment.api_url + "/api/api/user";
const API_IS_UNIQUE = environment.api_url + "api/api/user/emailUnique";
const API_USER = environment.api_url + "api/api/user";
const API_GET_BY_FILTER = environment.api_url + "/api/user/filter";
const API_GET_PROFIL = environment.api_url + "/api/user/profil";
const API_GET_PUBLIC_DATA = environment.api_url + "/api/user/auth-info";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUserPublicData(email:string): Observable<User> {
    let url = API_GET_PUBLIC_DATA + "?email=" + email;

    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      })
    };
    
    return this.http.get<User>(url, opts);
  }

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
      map(users => users.map(response => {
        return new User(response);
      }))
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
    let body = {
      id: id,
      email: email,
      firstName: firstName,
      lastName: lastName,
      RoleId: roleId
    }

    return this.http.put<User>(API_USER, body);
  }

  createUser(user: User, pwd): Observable<User> {
    let body = {
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      RoleId: user.role_id,
      roleName: user.role_name,
      password: pwd
    }
    return this.http.post<User>(API_USER, body);
  }

  getUserByFilter(user: User){

    let url = API_GET_BY_FILTER + "?name=" + user.first_name;
    url += "&lastName=" + user.last_name;
    url += "&email=" + user.email;
    url += "&role=" + user.role_name;
    url += "&id=" + user.id;

    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')  // tslint:disable-line:object-literal-key-quotes
      })
    };
    
    return this.http.get<User[]>(url, opts);
  }
}
