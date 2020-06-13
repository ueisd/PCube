import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  authenticated: boolean;
  accessLevel: number;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.auth.subscribe(
      (authenticated) => {
        this.authenticated = authenticated;
        this.accessLevel = -1;
        if(authenticated){
          if(this.auth.isAdmin()){
            this.accessLevel = 3;
          } else if (this.auth.isProjectManager()){
            this.accessLevel = 2;
          } else if (this.auth.isMember()){
            this.accessLevel = 1;
          }
        }
      }
    );
  }

}
