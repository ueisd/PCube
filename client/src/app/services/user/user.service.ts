import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/user';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const API_USER = environment.api_url + '/api/user';
const API_IS_UNIQUE = API_USER + '/emailUnique';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getAllUser(): Observable<User[]> {
    return this.http.get<User[]>(API_USER).pipe(map((users) => users.map((response) => new User(response))));
  }

  deleteUser(id): Observable<{}> {
    return this.http.delete(API_USER + '/' + id);
  }

  isEmailUnique(email): Observable<boolean> {
    const url = API_IS_UNIQUE + '/' + email;
    return this.http.get<boolean>(url);
  }

  modifyUser(id, email, firstName, lastName, roleId: number) {
    return this.http.put<User>(API_USER, { id, email, firstName, lastName, RoleId: roleId });
  }

  createUser(user: User, pwd): Observable<User> {
    return this.http.post<User>(API_USER, {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      RoleId: user.role.id,
      roleName: user.role.name,
      password: pwd,
    });
  }
}
