import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from 'src/app/models/role';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class RoleService {
  url = environment.api_url + '/api/api/roles';
  constructor(private http : HttpClient) { }

  getRoles() : Observable<Role[]>{
    return this.http.get<Role[]>(this.url).pipe(
      map(users => users.map(response => {
        return Role.fetchFromRoleResponse(response);
      }))
    );
  }
}
