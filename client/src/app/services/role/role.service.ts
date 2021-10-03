import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from 'src/app/models/role';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

const API_ROLE = environment.api_url + 'api/roles';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  constructor(private http : HttpClient) { }

  getRoles() : Observable<Role[]>{
    return this.http.get<Role[]>(API_ROLE).pipe(
      map(users => users.map(response => 
        Role.fetchFromRoleResponse(response)
      ))
    );
  }
}
