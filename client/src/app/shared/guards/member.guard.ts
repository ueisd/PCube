import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } 
  from '@angular/router';
import { Observable } from 'rxjs';
import { CurentUserService } from '../services/curent-user.service';
import { map } from 'rxjs/operators';

@Injectable()
export class MemberGuard implements CanActivate {

  constructor(
    private curentUserService: CurentUserService
  ) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> {
        return this.curentUserService.curentUser.pipe(map(
            user => 
                user.accessLevel 
                && user.accessLevel > 0
                && user.accessLevel <= 3
        ));
    }

    canActivateChild(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> {
        return this.curentUserService.curentUser.pipe(map(
            user => 
                user.accessLevel 
                && user.accessLevel > 0 
                && user.accessLevel<= 3
        ));
    }
}
