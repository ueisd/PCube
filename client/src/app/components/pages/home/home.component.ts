import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SidenavComponent } from 'src/app/components/layouts/sidenav/sidenav.component';
import { HeaderComponent } from '../../layouts/header/header.component';
import { MatDrawer } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})

export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild(SidenavComponent) sideNavReference;
  @ViewChild("drawer") drawerComponent:MatDrawer;
  @ViewChild("header") headerComponent:HeaderComponent;

  isShowTitle:boolean = true;
  isAuthenticated:boolean = false;
  autSubscription: Subscription;

  constructor(
    private auth: AuthService,
    public router: Router
  ) { }

  ngOnInit(): void {
    if(this.auth.jwtToken.value.isAuthenticated)
      this.onAuthValid();
    this.autSubscription = this.auth.jwtToken.subscribe(token => {
      if(token.isAuthenticated)
        this.onAuthValid();
      else
        this.onAuthInvalid();
    });
  }

  ngAfterViewInit(){
    this.isShowTitle =  this.sideNavReference.isShowTitle;
  }

  async onAuthValid(){
    this.isAuthenticated = true;
    setTimeout(() => {
      this.drawerComponent.open();
    }, 800);
  }

  onAuthInvalid(){
    this.isAuthenticated = false;
  }

  toggleSidebar(){
    this.sideNavReference.isShowTitle = !this.sideNavReference.isShowTitle;
    this.isShowTitle =  this.sideNavReference.isShowTitle;
  }

  ngOnDestroy() {
    this.autSubscription.unsubscribe();
  }

}
