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
