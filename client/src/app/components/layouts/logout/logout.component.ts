import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';


@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private router: Router,
              private auth: AuthService) { }

  ngOnInit() {
    this.showLogOutButton = true;
  }

  showLogOutButton:boolean;

  async logout() {
    await this.auth.deauthenticate().toPromise();
    if(this.router.url == "/")
          location.reload();
    else{
      this.router.navigate(['/']).then(()=>{
        window.location.reload();
      });
    }
  }
}