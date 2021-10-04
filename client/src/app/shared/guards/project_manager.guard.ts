import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } 
  from '@angular/router';
import { Observable } from 'rxjs';
import { CurentUserService } from '../services/curent-user.service';
import { map } from 'rxjs/operators';
import { User } from 'src/app/models/user';

@Injectable()
export class ProjectManagerGuard implements CanActivate {

  constructor(
    private curentUserService: CurentUserService
  ) {}

  private canPass(user : User): boolean {
    return user 
        && user.role.access_level
        && user.role.access_level > 0
        && user.role.access_level <= 2
  }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> {
        return this.curentUserService.curentUser.pipe(map(
            curent => this.canPass(curent.user)
        ));
    }

    canActivateChild(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> {
        return this.curentUserService.curentUser.pipe(map(
            curent => this.canPass(curent.user)
        ));
    }
}
