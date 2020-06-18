import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectItem } from 'src/app/components/domain/project/project-item/project';

const ALL_PROJECT_API = "/api/project/get-all-project";

@Injectable({
  providedIn: 'root'
})

export class ProjectService {

  constructor(private http: HttpClient) { }

  getAllProject(): Observable<ProjectItem[]>{
    // now get user info
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')  // tslint:disable-line:object-literal-key-quotes
      })
    };
    return this.http.get<ProjectItem[]>(ALL_PROJECT_API, opts);
  }


}
