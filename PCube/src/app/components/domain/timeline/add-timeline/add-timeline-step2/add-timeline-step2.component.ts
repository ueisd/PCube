import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProjectItem } from 'src/app/models/project';
import { ProjectService } from 'src/app/services/project/project.service';

const NORMAL_CLASS = "alert-primary";
const SUCCESS_CLASS = "alert-success";
const WARNING_CLASS = "alert-warning";
const DANGER_CLASS = "alert-danger";

const FOCUSED_CLASS = "on-focus";
const NOT_FOCUSED_CLASS = "not-on-focus";

const NORMAL_MESSAGE = "Veuillez saisir un projet";

@Component({
  selector: 'app-add-timeline-step2',
  templateUrl: './add-timeline-step2.component.html',
  styleUrls: ['../add-timeline.component.css']
})
export class AddTimelineStep2Component implements OnInit {

  constructor(
    private projectService: ProjectService
  ) { }

  isSearchByName:boolean = true;

  message:string = NORMAL_MESSAGE;
  messageClasse:string = NORMAL_CLASS;

  idClass:string = NOT_FOCUSED_CLASS;
  nameClass:string = FOCUSED_CLASS;

  name = new FormControl();
  id = new FormControl();

  public project:ProjectItem = new ProjectItem();

  ngOnInit(): void {
    this.displayedColumns = ['id','name', 'parent_id'];
  }

  onEmptyValue(){
    this.message = NORMAL_MESSAGE
    this.messageClasse = NORMAL_CLASS;
    this.project = new ProjectItem();
    this.projects = [];
  }

  onNameChange(value){
    let project = new ProjectItem();
    project.name = value;
    if(value){
      this.callProjectService(project);
    }else{
      this.onEmptyValue();
    }
  }

  onIdChange(value){   
    let project = new ProjectItem();
    project.id = value
    if(value){
      this.callProjectService(project);
    }else{
      this.onEmptyValue();
    } 
  }

  projects:ProjectItem[] = [];
  displayedColumns : string[];

  onNoProjectFound(){
    this.message = "Aucun projet trouvé"
    this.messageClasse = WARNING_CLASS;
  }

  onMultipleProjectFound(){
    this.message = "Veuillez sélectionner un projet."
    this.messageClasse = WARNING_CLASS;
  }

  onProjectFound(){
    this.message = this.project.name;
    this.messageClasse = SUCCESS_CLASS;
  }

  onProjectSubscribtionReceive(projects:ProjectItem[], project:ProjectItem){
    if(projects.length == 0){
      this.onNoProjectFound();
      return;
    }

    if(projects.length > 1){
      this.projects = projects;
      this.onMultipleProjectFound();
      return;
    }

    if(projects.length == 1 && (projects[0].id == project.id || projects[0].name.toLocaleUpperCase() == project.name.toLocaleUpperCase())){
      this.onProjectFound();
      this.project = projects[0];
    }
    else
      this.onMultipleProjectFound();
  }

  callProjectService(project:ProjectItem){

    if(this.isOnRowClicked){
      this.isOnRowClicked = false;
      return;
    }

    this.projectService.getOneLevelProjectByFilter(project).subscribe(projects => {
      this.projects = projects;
      this.onProjectSubscribtionReceive(projects, project);
    }, error =>{
      this.message = "Une erreur est survenue, veuillez réessayer."
      this.messageClasse = DANGER_CLASS;
      this.projects = [];
    })
  }

  isOnRowClicked: boolean = false;

  onRowClicked(project){
    this.isOnRowClicked = true;
    this.projects = [project];
    this.project = project;

    if(this.isSearchByName){
      this.name.setValue(project.name);
    }else{
      this.id.setValue(project.id);
    }

    this.onProjectFound();

  }

  onIdClick(){
    this.isSearchByName = false;
    this.changeToggleTexteDisplay(this.isSearchByName);
  }

  onNameClick(){
    this.isSearchByName = true;
    this.changeToggleTexteDisplay(this.isSearchByName);
  }

  changeToggleTexteDisplay(searchValue:boolean){
    this.nameClass = (searchValue) ? FOCUSED_CLASS : NOT_FOCUSED_CLASS;
    this.idClass = (!searchValue) ? FOCUSED_CLASS : NOT_FOCUSED_CLASS;
  }

  searchToggle(){
    this.changeToggleTexteDisplay(!this.isSearchByName);
    if(!this.isSearchByName){
      this.onNameChange(this.name.value);
    }else{
      this.onIdChange(this.id.value);
    }
  }
}
