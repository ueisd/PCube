import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';

const NORMAL_CLASS = "alert-secondary";
const SUCCESS_CLASS = "alert-success";
const WARNING_CLASS = "alert-warning";

@Component({
  selector: 'app-add-timeline-step1',
  templateUrl: './add-timeline-step1.component.html',
  styleUrls: ['./add-timeline-step1.component.css']
})

export class AddTimelineStep1Component implements OnInit {



  constructor(
    private userService: UserService
  ) { }

  isSearchByEmail:boolean = true;

  message:string = "Veuillez saisir un utilisateur existant"
  messageClasse:string = NORMAL_CLASS;

  email = new FormControl();
  id = new FormControl();

  public user:User = new User();

  ngOnInit(): void {
  }

  onEmailChange(value){
    let user = new User();
    user.email = value;
    this.callUserService(user);
  }

  onIdChange(value){
    
    let user = new User();
    user.email = value
    this.callUserService(user);
  }

  callUserService(user:User){
    this.userService.getUser(user).subscribe(user => {
      this.message = "Profil trouvé."
      this.messageClasse = SUCCESS_CLASS;
      this.user = user;
    }, error =>{
      this.message = "Aucun utilisateur existant."
      this.messageClasse = WARNING_CLASS;
      this.user = new User();
    })
  }

  searchToggle(){
    if(!this.isSearchByEmail){
      this.onEmailChange(this.email.value);
    }else{
      this.onIdChange(this.id.value);
    }
  }
}
