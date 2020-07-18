import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from "rxjs";
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class GlobalHttpInterceptorService implements HttpInterceptor {

  constructor(
    public router: Router,
    private auth: AuthService
  ) { }

  onExpiredCredentiel(){

    if(localStorage.getItem('email') && localStorage.getItem('accessToken')){
      localStorage.clear();
      this.router.navigate(['/']).then(() => {
        window.location.reload();
        return throwError("Expired credential");
      });
      
    }else{
      return throwError("Invalid credential");
    }
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      catchError((error) => {

        if (error.status >= 500 && error.status <= 599) {
          this.router.navigate(["server-down"]);
          return throwError("The server is not responding");
        } else if (error.status >= 401) {
          this.onExpiredCredentiel();
        }

        return throwError(error.message);
      })
    )
  }
}