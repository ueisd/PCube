import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { User } from 'src/app/models/user';
import { Subscription } from 'rxjs';
import { CurentUserService } from 'src/app/shared/services/curent-user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  curentUserSubscription: Subscription = this.curentUserService.curentUser.subscribe(
    current => {
      let user = current.user;
      if(user) {
        this.user.email = user.email;
        this.user.firstName = user.firstName;
        this.user.last_name = user.last_name;
      }
    }
  );
  
  user:User = new User();

  constructor(
    private router: Router,
    private auth: AuthService,
    private curentUserService: CurentUserService
    ) { 
  }

  ngOnInit(): void {}

  async logout() {
    this.auth.logout();
    if(this.router.url != "/")
      this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.curentUserSubscription.unsubscribe();
  }
}
