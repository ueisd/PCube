import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/user';
import { Observable } from 'rxjs';

const API_ALL_USER = environment.api_url + "/api/user";
const API_IS_UNIQUE = environment.api_url + "/api/user/is-unique-user";
const API_USER = environment.api_url + "/api/user";
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
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')  // tslint:disable-line:object-literal-key-quotes
      })
    };
    
    return this.http.get<User[]>(API_ALL_USER, opts);
  }

  deleteUser(id, email): Observable<{}> {
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),  // tslint:disable-line:object-literal-key-quotes
        'Content-Type' : 'application/json'
      }),
      body : {
        id: id,
        email: email
      }
    };

    return this.http.delete(API_USER, opts);
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

  modifyUser(id, email, firstName, lastName, newEmail, roleId : number) {
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

  createUser(user: User, pwd, confirmedPwd): Observable<User> {

    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),  // tslint:disable-line:object-literal-key-quotes
        'Content-Type': 'application/json'
      })
    };

    let body = {
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role_id: user.role_id,
      password: pwd,
      password_confirmed: confirmedPwd
    }

    return this.http.post<User>(API_USER, body, opts);
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
