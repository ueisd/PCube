import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserAuth } from 'src/app/components/domain/user/user-auth';
import { Subscription } from 'rxjs';
import { SidenavComponent } from 'src/app/components/layouts/sidenav/sidenav.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild(SidenavComponent) sideNavReference;


  authenticated: boolean;
  accessLevel: number;

  events: string[] = [];
  opened: boolean = true;

  constructor(private auth: AuthService) { }

  authSubscription: Subscription;

  ngOnInit(): void {
    this.auth.subscribe(
      (authenticated) => {
        this.authenticated = authenticated;
        this.accessLevel = -1;
        if(authenticated){
          this.authSubscription = this.auth.getAccessLevel().subscribe(userInfo => {
            this.accessLevel = parseInt(userInfo.level)
            this.sideNavReference.accessLevel = this.accessLevel;
          });
        }
      }
    );
  }

  ngOnDestroy() { 
    this.authSubscription.unsubscribe();
  }

}
