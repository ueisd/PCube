import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
  })
  export class MemberGuard implements CanActivate, CanActivateChild {
    constructor(private auth: AuthService,
                private router: Router) { }
  
    canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  
      if (this.auth.isMember() || this.auth.isAdmin() || this.auth.isProjectManager()) {
        return true;
      } else {
        this.router.navigate(['/denied']);
      }
    }
  
    canActivateChild(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  
      if (this.auth.isMember() || this.auth.isAdmin() || this.auth.isProjectManager()) {
        return true;
      } else {
        this.router.navigate(['/denied']);
      }
    }
  }