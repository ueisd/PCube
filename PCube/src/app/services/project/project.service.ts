import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectItem } from 'src/app/models/project';

const API_PROJECT = "/api/project";
const API_IS_UNIQUE = "api/project/is-unique";
const API_AUTOCOMPLTE = "api/project/autocomplete";
const API_FILTER = "/api/project/filter";
const API_APPARENTABLE = "/api/project/getApparentableProjects";

@Injectable({
  providedIn: 'root'
})

export class ProjectService {

  constructor(private http: HttpClient) { }

  getAllProject(): Observable<ProjectItem[]>{
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')  // tslint:disable-line:object-literal-key-quotes
      })
    };
    return this.http.get<ProjectItem[]>(API_PROJECT, opts);
  }

  getApparentableProject(id: number): Observable<ProjectItem[]>{
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')  // tslint:disable-line:object-literal-key-quotes
      })
    };
    return this.http.get<ProjectItem[]>(API_APPARENTABLE + "/" + id, opts);
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

  updateProject(projetct: ProjectItem): Observable<ProjectItem>{
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),  // tslint:disable-line:object-literal-key-quotes
        'Content-Type': 'application/json'
      })
    };
   
    let body = {
      id: projetct.id,
      projectName: projetct.name,
      parent_id: projetct.parent_id,
    }
    
    return this.http.put<ProjectItem>(API_PROJECT, body, opts);
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

  filterProject(projet: ProjectItem): Observable<ProjectItem[]>{
    let url = API_FILTER + "?name=" + projet.name;
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')  // tslint:disable-line:object-literal-key-quotes
      })
    };
    return this.http.get<ProjectItem[]>(url, opts);
  }
}
