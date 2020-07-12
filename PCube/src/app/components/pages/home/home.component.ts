import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserAuth } from 'src/app/models/user-auth';
import { Subscription } from 'rxjs';
import { SidenavComponent } from 'src/app/components/layouts/sidenav/sidenav.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})

export class HomeComponent implements OnInit {
  @ViewChild(SidenavComponent) sideNavReference;
  @ViewChild("drawer") drawerComponent;


  authenticated: boolean;
  accessLevel: number;

  events: string[] = [];
  opened: boolean = true;

  constructor(
    private auth: AuthService,
    public router: Router
    ) { }

  authSubscription: Subscription;

  ngOnInit(): void {
    this.checkForAuth();
  }

  ngAfterViewInit(){
    this.isShowTitle =  this.sideNavReference.isShowTitle;
  }

  isDrawerHidden:boolean = false;
  isHeaderHidden:boolean = true;

  checkForAuth(){
    this.auth.subscribe(
      (authenticated) => {
        this.authenticated = authenticated;
        this.accessLevel = -1;
        if(authenticated){
          this.isDrawerHidden = false;
          this.authSubscription = this.auth.getAccessLevel().subscribe(userInfo => {
            this.accessLevel = parseInt(userInfo.level)
            this.sideNavReference.accessLevel = this.accessLevel;
            setTimeout(() => {
              this.isHeaderHidden = false;
            }, 800);
            setTimeout(() => {
              this.drawerComponent.toggle();
            }, 1200);
          });
        }else{
          this.accessLevel = -1;
          this.isDrawerHidden = true;
          this.isHeaderHidden = true;
        }
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
