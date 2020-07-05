import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';
import { flatMap } from 'rxjs/operators';

const NORMAL_CLASS = "alert-primary";
const SUCCESS_CLASS = "alert-success";
const WARNING_CLASS = "alert-warning";
const DANGER_CLASS = "alert-danger";

const FOCUSED_CLASS = "on-focus";
const NOT_FOCUSED_CLASS = "not-on-focus";

const NORMAL_MESSAGE = "Veuillez saisir un utilisateur";

@Component({
  selector: 'app-add-timeline-step1',
  templateUrl: './add-timeline-step1.component.html',
  styleUrls: ['../add-timeline.component.css']
})

export class AddTimelineStep1Component implements OnInit {

  @Output() isFormValidEvent = new EventEmitter<boolean>();
  @Output() ouputUser = new EventEmitter<User>();

  constructor(
    private userService: UserService
  ) { }

  isSearchByEmail:boolean = true;

  message:string = NORMAL_MESSAGE;
  messageClasse:string = NORMAL_CLASS;

  idClass:string = NOT_FOCUSED_CLASS;
  emailClass:string = FOCUSED_CLASS;

  email = new FormControl();
  id = new FormControl();

  public user:User = new User();

  ngOnInit(): void {
    this.displayedColumns = ['identifiant','firstName', 'lastName', 'email', 'role'];
  }

  callOuputEvent(isSuccess){
    this.isFormValidEvent.emit(isSuccess);
    this.ouputUser.emit(this.user);
  }

  onEmptyValue(){
    this.message = NORMAL_MESSAGE
    this.messageClasse = NORMAL_CLASS;
    this.user = new User();
    this.users = [];
    this.callOuputEvent(false);
  }

  onEmailChange(value){
    let user = new User();
    user.email = value;
    if(value){
      this.callUserService(user);
    }else{
      this.onEmptyValue();
    }
  }

  onIdChange(value){   
    let user = new User();
    user.id = value
    if(value){
      this.callUserService(user);
    }else{
      this.onEmptyValue();
    } 
  }

  users:User[] = [];
  displayedColumns : string[];

  onNoUserFound(){
    this.message = "Aucun utilisateur trouvé"
    this.messageClasse = WARNING_CLASS;
    this.callOuputEvent(false);
  }

  onMultipleUserFound(){
    this.message = "Veuillez sélectionner un utilisateur."
    this.messageClasse = WARNING_CLASS;
    this.callOuputEvent(false);
  }

  onUserFound(){
    this.message = this.user.first_name + " " + this.user.last_name;
    this.messageClasse = SUCCESS_CLASS;
    this.callOuputEvent(true);
  }

  onUserSubscribtionReceive(users:User[], user:User){
    if(users.length == 0){
      this.onNoUserFound();
      return;
    }

    if(users.length > 1){
      this.users = users;
      this.onMultipleUserFound();
      return;
    }

    if(users.length == 1 && (users[0].id == user.id || users[0].email.toLocaleUpperCase() == user.email.toLocaleUpperCase())){
      this.user = users[0];
      this.onUserFound();
    }
    else
      this.onMultipleUserFound();
  }

  callUserService(user:User){

    if(this.isOnRowClicked){
      this.isOnRowClicked = false;
      return;
    }

    this.userService.getUserByFilter(user).subscribe(users => {
      this.users = users;
      this.onUserSubscribtionReceive(users, user);
    }, error =>{
      this.message = "Une erreur est survenue, veuillez réessayer."
      this.messageClasse = DANGER_CLASS;
      this.users = [];
    })
  }

  isOnRowClicked: boolean = false;

  onRowClicked(user){
    this.isOnRowClicked = true;
    this.users = [user];
    this.user = user;

    if(this.isSearchByEmail){
      this.email.setValue(user.email);
    }else{
      this.id.setValue(user.id);
    }

    this.onUserFound();

  }

  onIdClick(){
    this.isSearchByEmail = false;
    this.changeToggleTexteDisplay(this.isSearchByEmail);
    this.onIdChange(this.id.value);
  }

  onEmailClick(){
    this.isSearchByEmail = true;
    this.changeToggleTexteDisplay(this.isSearchByEmail);
    this.onEmailChange(this.email.value);
  }

  changeToggleTexteDisplay(searchValue:boolean){
    this.emailClass = (searchValue) ? FOCUSED_CLASS : NOT_FOCUSED_CLASS;
    this.idClass = (!searchValue) ? FOCUSED_CLASS : NOT_FOCUSED_CLASS;
  }

  searchToggle(){
    this.changeToggleTexteDisplay(!this.isSearchByEmail);
    if(!this.isSearchByEmail){
      this.onEmailChange(this.email.value);
    }else{
      this.onIdChange(this.id.value);
    }
      
  }
}
