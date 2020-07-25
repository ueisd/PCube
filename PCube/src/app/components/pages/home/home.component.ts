import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Subscription } from 'rxjs';
import { SidenavComponent } from 'src/app/components/layouts/sidenav/sidenav.component';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../layouts/header/header.component';
import { ContactUsComponent } from '../contact-us/contact-us.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})

export class HomeComponent implements OnInit {
  @ViewChild(SidenavComponent) sideNavReference;
  @ViewChild("drawer") drawerComponent;
  @ViewChild("header") headerComponent:HeaderComponent;
  @ViewChild(ContactUsComponent) contactUsComponent:ContactUsComponent;

  authenticated: boolean;
  accessLevel: number;

  events: string[] = [];
  opened: boolean = true;

  constructor(
    private auth: AuthService,
    public router: Router
    ) { 
      this.checkForAuth();
    }

  authSubscription: Subscription;

  ngOnInit(): void {
    
  }

  ngAfterViewInit(){
    this.isShowTitle =  this.sideNavReference.isShowTitle;
  }

  isDrawerHidden:boolean = false;
  isHeaderHidden:boolean = true;

  setHeaderUserInfo(user){
    this.headerComponent.user.email = user.email;
    this.headerComponent.user.first_name = user.first_name;
    this.headerComponent.user.last_name = user.last_name;
  }

  setContactUsUserInfo(user){
    this.contactUsComponent.user.email = user.email;
    this.contactUsComponent.user.first_name = user.first_name;
    this.contactUsComponent.user.last_name = user.last_name;
  }

  setSideNavUserInfo(user){
    this.sideNavReference.user.email = user.email;
    this.sideNavReference.user.first_name = user.first_name;
    this.sideNavReference.user.last_name = user.last_name;
    this.sideNavReference.user.access_level = parseInt(user.level);
  }

  onAuthValid(){

    this.isDrawerHidden = false;
    this.authSubscription = this.auth.getAccessLevel().subscribe(userInfo => {
      console.log(this.headerComponent);
      console.log(this.contactUsComponent);
      if(this.headerComponent)
        this.setHeaderUserInfo(userInfo);

      if(this.contactUsComponent)
        this.setContactUsUserInfo(userInfo);

      if(this.sideNavReference)
        this.setSideNavUserInfo(userInfo);

      this.accessLevel = parseInt(userInfo.level)
      this.sideNavReference.accessLevel = this.accessLevel;
      setTimeout(() => {
        this.isHeaderHidden = false;
      }, 800);
      setTimeout(() => {
        this.drawerComponent.toggle();
      }, 1200);
    });
  }

  onAuthInvalid(){
    this.accessLevel = -1;
    this.isDrawerHidden = true;
    this.isHeaderHidden = true;
  }

  checkForAuth(){
    this.auth.subscribe(
      (authenticated) => {
        this.authenticated = authenticated;
        this.accessLevel = -1;
        if(authenticated)
          this.onAuthValid();
        else
          this.onAuthInvalid();
      }
    );
  }

  ngOnDestroy() { 
    this.authSubscription.unsubscribe();
  }

  isShowTitle:boolean = true;

  toggleDrawer(){
    this.sideNavReference.isShowTitle = !this.sideNavReference.isShowTitle;
    this.isShowTitle =  this.sideNavReference.isShowTitle;
  }

}
