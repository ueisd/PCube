import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from 'src/app/models/role';


@Injectable({
  providedIn: 'root'
})
export class RoleService {
  url = '/api/roles';
  constructor(private http : HttpClient) { }

  getRoles() : Observable<Role[]>{
    return this.http.get<Role[]>(this.url);
  }
}
