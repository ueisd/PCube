import { Component, OnInit, ViewChild } from '@angular/core';
import { LogoutComponent } from '../logout/logout.component';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @ViewChild(LogoutComponent) logOutComponent;

  user:User = new User();

  constructor(
    private router: Router,
    private auth: AuthService
    ) { 
    this.user.email = localStorage.getItem('email');
  }

  ngOnInit(): void {
  }

  logout() {
    this.auth.deauthenticate().subscribe(
      () => {
        if(this.router.url == "/")
          location.reload();
        else{
          this.router.navigate(['/']).then(()=>{
            window.location.reload();
          });
        }
      }
    );
  }
}
