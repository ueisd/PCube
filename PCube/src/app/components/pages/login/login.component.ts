import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import * as $ from 'jquery/dist/jquery.min.js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  message = '';
  formGroup: FormGroup;

  pageTitle = "Plateforme Petit Peuple";
  userName = "";

  isShowingForm:boolean = true;

  constructor(private auth: AuthService,
              private router: Router,
              private formBuilder: FormBuilder,
              private userService: UserService
              ) { }

  ngOnInit() {
    this.createForm();
    if(this.auth.isAuthenticated()){
      this.isShowingForm = false;
      this.showWelcomeMessage(true);
    }
  }

  createForm(){
    this.formGroup = this.formBuilder.group({
      'email': [null, [Validators.required]],
      'password': [null, [Validators.required]]
    });
  }

  isAuthAccepted:boolean = false;

  async showWelcomeMessage(isAlreadyAuth:boolean){
    this.isAuthAccepted = true;
    let user = await this.userService.getUserPublicData(localStorage.getItem('email')).toPromise();
    this.pageTitle = "Bienvenue";
    if(!isAlreadyAuth){
      $('form').fadeOut(500);
    }
    $('.wrapper').addClass('form-success');
    setTimeout(() => {
      this.userName = user.first_name + " " + user.last_name;
    }, 500);
  }

  async onSubmit() {
    const email = this.formGroup.get('email').value;
    const password = this.formGroup.get('password').value;

    try {
      await this.auth.authenticate(email, password).toPromise();
      this.message = "";
      this.showWelcomeMessage(false);
    } catch(error) {
      this.message = error;
    }
  }
}
