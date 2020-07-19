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

  showWelcomeMessage(isAlreadyAuth:boolean){
    this.isAuthAccepted = true;
    this.userService.getUserPublicData(localStorage.getItem('email')).subscribe(user => {
      this.pageTitle = "Bienvenue";
      if(!isAlreadyAuth){
        $('form').fadeOut(500);
      }
      $('.wrapper').addClass('form-success');
      setTimeout(() => {
        this.userName = user.first_name + " " + user.last_name;
      }, 500);
    });
  }

  onSubmit() {
    const email = this.formGroup.get('email').value;
    const password = this.formGroup.get('password').value;
    this.auth.authenticate(email, password).subscribe(
      () => {
        this.message = "";
        this.showWelcomeMessage(false);
      },
      (error) => {
        this.message = error;
      }
    );
  }
}
