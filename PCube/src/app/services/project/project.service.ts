import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectItem } from 'src/app/models/project';
import { environment } from 'src/environments/environment';

const API_PROJECT = environment.api_url + "/api/project";
const API_IS_UNIQUE = environment.api_url + "/api/project/is-unique";
const API_AUTOCOMPLTE = environment.api_url + "/api/project/autocomplete";
const API_FILTER = environment.api_url + "/api/project/filter";
const API_APPARENTABLE = environment.api_url + "/api/project/getApparentableProjects";
const API_ONE_LEVEL_FILTER = environment.api_url + "/api/project/filter/one-level";
const API_IS_DELETABLE = environment.api_url + "/api/project/is-deletable";

const SEPARATOR: string = " * ";

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

   /* Crée une liste des noeuds de l'arborescence 
   * avec un affichage identé selon le niveua de profondeur @level
   */
  generateParentOption(projets: ProjectItem[], level:number) : ProjectItem[] {
    if(projets === null) return [];
    let retour: ProjectItem[] = [];

    for (var projet of projets) {
      let item : ProjectItem = new ProjectItem(projet);
      item.child_project = null;
      item.nomAffichage = item.name;
      for(let i = 0; i<level; i++) {
        item.nomAffichage = SEPARATOR + item.nomAffichage;
      }
      retour.push(item);
      if(projet.child_project != undefined && projet.child_project.length != undefined) {
        for(var sprojet of this.generateParentOption(projet.child_project, level+1))
          retour.push(sprojet);
      }
    }
    return retour;
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

  getOneLevelProjectByFilter(projet: ProjectItem): Observable<ProjectItem[]> {
    let url = API_ONE_LEVEL_FILTER + "?name=" + projet.name;
    url += "&id=" + projet.id;
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')  // tslint:disable-line:object-literal-key-quotes
      })
    };
    return this.http.get<ProjectItem[]>(url, opts);
  }

  deleteProject(id, name:string) {
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),  
      }),
      body: {
        id: id,
        name: name
      }
    };

    return this.http.delete(API_PROJECT, opts);
  }

  isProjectDeletable(id, name:string): Observable<boolean> {
    let url = API_IS_DELETABLE + "/" + id + "/" + name;
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),  
      })
    };

    return this.http.get<boolean>(url, opts);
  }
}
