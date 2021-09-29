import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectItem } from 'src/app/models/project';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { DataTreeFetcher } from 'src/app/models/utils/DataTreeFetcher';

const API_PROJECT = environment.api_url + "api/api/project";
const API_IS_UNIQUE = environment.api_url + "api/api/project/is-name-unique";
const API_AUTOCOMPLTE = environment.api_url + "/api/project/autocomplete";
const API_FILTER = environment.api_url + "/api/project/filter";
const API_APPARENTABLE = environment.api_url + "/api/project/getApparentableProjects";
const API_ONE_LEVEL_FILTER = environment.api_url + "/api/project/filter/one-level";
const API_IS_DELETABLE = environment.api_url + "api/api/project/is-deletable";

const SEPARATOR: string = " * ";

@Injectable({
  providedIn: 'root'
})

export class ProjectService {

  constructor(private http: HttpClient) { }

  getAllProject(): Observable<ProjectItem[]>{

    return this.http.get<ProjectItem[]>(API_PROJECT).pipe(
      map(projects => 
      {
        let ret = projects.map(response => {
          return ProjectItem.fetchProjectFromResponse(response);
        });
        return ret;
      }
        

      )
    );
  }


  //équivalent de getParentOptions
  getApparentableProject(id: number): Observable<ProjectItem[]>{
    return this.getAllProject().pipe(
      map(
        projets => DataTreeFetcher.fetchProjectTree({
            itemList: projets,
            fieldsNames : {
                childs:     'child_project',
                id :        'id',
                parentId :  'parent_id'
            }
          }, id) 
      )
    )
  }

  getParentOptions(id: number): Observable<ProjectItem[]>{
    return this.getApparentableProject(id).pipe(
      map(
        projets => {
          return this.generateParentOption(projets, 0);
        }
    ));
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

  addNewProject(name, parentId): Observable<ProjectItem>{
    let body = {
      name: name,
      ProjectId: parentId
    }
    return this.http.post<ProjectItem>(API_PROJECT, body);
  }

  updateProject(projetct: ProjectItem): Observable<ProjectItem>{  
    let body = {
      id: projetct.id,
      name: projetct.name,
      ProjectId: projetct.parent_id,
    }
    return this.http.put<ProjectItem>(API_PROJECT, body);
  }
  
  isNameUnique(name): Observable<boolean> {

    var url = API_IS_UNIQUE
    let body = { 
      id: -1,
      name: name
    }
    return this.http.post<boolean>(url, body);
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

  deleteProject(id) {
    return this.http.delete(API_PROJECT + "/" + id);
  }

  isProjectDeletable(id, name:string): Observable<boolean> {
    let url = API_IS_DELETABLE + "/" + id
    return this.http.get<boolean>(url);
  }
}
