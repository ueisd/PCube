import { Component, OnInit } from '@angular/core';
import { ActivityItem } from 'src/app/models/activity';
import { ActivityService } from 'src/app/services/activity/activity.service';
import { FormControl } from '@angular/forms';

const NORMAL_CLASS = "alert-primary";
const SUCCESS_CLASS = "alert-success";
const WARNING_CLASS = "alert-warning";
const DANGER_CLASS = "alert-danger";

const FOCUSED_CLASS = "on-focus";
const NOT_FOCUSED_CLASS = "not-on-focus";

const NORMAL_MESSAGE = "Veuillez saisir une activité";


@Component({
  selector: 'app-add-timeline-step3',
  templateUrl: './add-timeline-step3.component.html',
  styleUrls: ['../add-timeline.component.css']
})
export class AddTimelineStep3Component implements OnInit {

  constructor(
    private activityService: ActivityService
  ) { }

  isSearchByName:boolean = true;

  message:string = NORMAL_MESSAGE;
  messageClasse:string = NORMAL_CLASS;

  idClass:string = NOT_FOCUSED_CLASS;
  nameClass:string = FOCUSED_CLASS;

  name = new FormControl();
  id = new FormControl();

  public activity:ActivityItem = new ActivityItem();

  ngOnInit(): void {
    this.displayedColumns = ['id','name', 'parent_id'];
  }

  onEmptyValue(){
    this.message = NORMAL_MESSAGE
    this.messageClasse = NORMAL_CLASS;
    this.activity = new ActivityItem();
    this.activities = [];
  }

  onNameChange(value){
    let activity = new ActivityItem();
    activity.name = value;
    if(value){
      this.callProjectService(activity);
    }else{
      this.onEmptyValue();
    }
  }

  onIdChange(value){   
    let activity = new ActivityItem();
    activity.id = value
    if(value){
      this.callProjectService(activity);
    }else{
      this.onEmptyValue();
    } 
  }

  activities:ActivityItem[] = [];
  displayedColumns : string[];

  onNoProjectFound(){
    this.message = "Aucune activité trouvé"
    this.messageClasse = WARNING_CLASS;
  }

  onMultipleProjectFound(){
    this.message = "Veuillez sélectionner une activité."
    this.messageClasse = WARNING_CLASS;
  }

  onProjectFound(){
    this.message = this.activity.name;
    this.messageClasse = SUCCESS_CLASS;
  }

  onProjectSubscribtionReceive(activities:ActivityItem[], activity:ActivityItem){
    if(activities.length == 0){
      this.onNoProjectFound();
      return;
    }

    if(activities.length > 1){
      this.activities = activities;
      this.onMultipleProjectFound();
      return;
    }

    if(activities.length == 1 && (activities[0].id == activity.id || activities[0].name.toLocaleUpperCase() == activity.name.toLocaleUpperCase())){
      this.onProjectFound();
      this.activity = activities[0];
    }
    else
      this.onMultipleProjectFound();
  }

  callProjectService(activity:ActivityItem){

    if(this.isOnRowClicked){
      this.isOnRowClicked = false;
      return;
    }

    this.activityService.filterActivity(activity).subscribe(activities => {
      this.activities = activities;
      this.onProjectSubscribtionReceive(activities, activity);
    }, error =>{
      this.message = "Une erreur est survenue, veuillez réessayer."
      this.messageClasse = DANGER_CLASS;
      this.activities = [];
    })
  }

  isOnRowClicked: boolean = false;

  onRowClicked(activity){
    this.isOnRowClicked = true;
    this.activities = [activity];
    this.activity = activity;

    if(this.isSearchByName){
      this.name.setValue(activity.name);
    }else{
      this.id.setValue(activity.id);
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
