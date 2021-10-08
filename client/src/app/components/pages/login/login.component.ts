import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { CurentUserService } from 'src/app/shared/services/curent-user.service';
import * as $ from 'jquery/dist/jquery.min.js';
import { Subscription } from 'rxjs';
import { HostListener } from '@angular/core';

import { environment } from 'src/environments/environment';

const API_GOOGLE_AUTH = environment.api_url + "/api/auth/google/";
// "http://localhost:3000/api/auth/google/"

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  
  conf = {
    message: '',
    pageTitle: "",
    userName: "",
  }

  isAuthenticated: boolean = false;
  authSubscribtion: Subscription;

  formGroup: FormGroup;

  constructor(
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private curentUserService: CurentUserService
  ) {
    this.isAuthenticated = this.auth.jwtToken.value.isAuthenticated;          
  }



  flogin(){
    window.open(
      API_GOOGLE_AUTH,
      "mywindow","location=1,status=1,scrollbars=1, width=800,height=800"
    );
   }
   
   @HostListener('window:message', ['$event'])
    onMessage(ev:MessageEvent) {
      let token = ev.data.oauth2CallbackToken;
      if(token)
        this.auth.connectWithToken(token)
    }

  ngOnInit() {
    this.conf = this.getTextForLogin();
    if(this.auth.jwtToken.value.isAuthenticated) {
      this.showWelcomeMessage();
    }else {
      this.createForm();
    }

    this.authSubscribtion = this.auth.jwtToken.subscribe(token => {
      let wasAuthenticated = this.isAuthenticated;
      
      if(this.isAuthenticated ==! token.isAuthenticated) {
        this.isAuthenticated = token.isAuthenticated;
        if(wasAuthenticated == false) { // on vient d'authentifier
          this.showWelcomeMessage();
          $('form').fadeOut(500);
        }else { // on vient de déconnecter
          this.conf = this.getTextForLogin();
          this.createForm();
          $('form').fadeIn(1000);
        }
      }    
    });
  }

  getTextForLogin() {
    return {
      pageTitle : "Plateforme Petit Peuple",
      message   : "",
      userName  : "",
    }
  }

  createForm(){
    this.formGroup = this.formBuilder.group({
      'email': [null, [Validators.required]],
      'password': [null, [Validators.required]]
    });
  }

  async showWelcomeMessage(){
    this.conf.pageTitle = "Bienvenue";
    setTimeout(() => {
      let user = this.curentUserService.curentUser.value.user;
      this.conf.userName = (user) ? user.getFullName() : "anonymous";
    }, 500);
  }

  async onSubmit() {
    const email = this.formGroup.get('email').value;
    const password = this.formGroup.get('password').value;

    try {
      await this.auth.signin({email: email, password:password }).subscribe(ret => {
        if(!ret){
          this.conf.message = "pas de token";
        }
      })
    } catch(error) {
      this.conf.message = error;
    }
  }

  ngOnDestroy() {
    this.authSubscribtion.unsubscribe();
  }
}
