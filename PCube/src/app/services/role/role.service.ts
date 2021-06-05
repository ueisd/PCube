import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from 'src/app/models/role';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RoleService {
  url = environment.api_url + '/api/roles';
  constructor(private http : HttpClient) { }

  getRoles() : Observable<Role[]>{
    return this.http.get<Role[]>(this.url);
  }
}
