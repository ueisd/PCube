import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class EnvTestService {

  constructor(private http:HttpClient) { }

  getTestMessage():Observable<string> {
    let url = 'api/role/1'
    return this.http.get<string>(url);
  }
}
