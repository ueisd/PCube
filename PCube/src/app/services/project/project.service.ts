import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectItem } from 'src/app/components/domain/project/project-item/project';

const API_PROJECT = "/api/project";
const API_IS_UNIQUE = "api/project/is-unique";
const API_AUTOCOMPLTE = "api/project/autocomplete";

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
    return this.http.get<ProjectItem[]>(API_PROJECT, opts);
  }

  addNewProject(name, parent_name): Observable<ProjectItem>{
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),  // tslint:disable-line:object-literal-key-quotes
        'Content-Type': 'application/json'
      })
    };
    let body = {
      name: name,
      parent_name: parent_name
    }
    return this.http.post<ProjectItem>(API_PROJECT, body, opts);
  }
  
  isNameUnique(name): Observable<boolean> {

    var url = API_IS_UNIQUE + "/" + name
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')  // tslint:disable-line:object-literal-key-quotes
      })
    };
    return this.http.get<boolean>(url, opts);
  }

  getProjectNameForAutocomplete(name): Observable<ProjectItem[]>{
    var url = API_AUTOCOMPLTE + "/" + name
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')  // tslint:disable-line:object-literal-key-quotes
      })
    };
    return this.http.get<ProjectItem[]>(url, opts);
  }
}
