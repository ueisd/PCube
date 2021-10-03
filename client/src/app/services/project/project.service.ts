import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectItem } from 'src/app/models/project';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { DataTreeFetcher } from 'src/app/models/utils/DataTreeFetcher';

const API_PROJECT = environment.api_url + "/api/project";
const API_IS_UNIQUE = environment.api_url + API_PROJECT +"/is-name-unique";
const API_IS_DELETABLE = environment.api_url + API_PROJECT + "/is-deletable";

const SEPARATOR: string = " * ";

@Injectable({
  providedIn: 'root'
})

export class ProjectService {

  constructor(private http: HttpClient) { }

  getAllProject(): Observable<ProjectItem[]>{
    return this.http.get<ProjectItem[]>(API_PROJECT).pipe(map(
      projects => projects.map(
          response => ProjectItem.fetchProjectFromResponse(response)
      )
    ));
  }


  //équivalent de getParentOptions
  getApparentableProject(id: number): Observable<ProjectItem[]>{
    return this.getAllProject().pipe(map(
        projets => DataTreeFetcher.fetchProjectTree(
          {
            itemList: projets,
            fieldsNames : {
                childs:     'child_project',
                id :        'id',
                parentId :  'parent_id'
            }
          }, 
          id
        ))
    );
  }

  getParentOptions(id: number): Observable<ProjectItem[]>{
    return this.getApparentableProject(id).pipe(map(
        projets => this.generateParentOption(projets, 0)
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
    return this.http.post<ProjectItem>(API_PROJECT, {
      name: name,
      ProjectId: parentId
    });
  }

  updateProject(projetct: ProjectItem): Observable<ProjectItem>{  
    return this.http.put<ProjectItem>(API_PROJECT, {
      id: projetct.id,
      name: projetct.name,
      ProjectId: projetct.parent_id,
    });
  }
  
  isNameUnique(name): Observable<boolean> {
    return this.http.post<boolean>(API_IS_UNIQUE, { 
      id: -1,
      name: name
    });
  }

  deleteProject(id) {
    return this.http.delete(API_PROJECT + "/" + id);
  }

  isProjectDeletable(id): Observable<boolean> {
    let url = API_IS_DELETABLE + "/" + id
    return this.http.get<boolean>(url);
  }
}
