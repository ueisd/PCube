import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const token = localStorage.getItem('jwt');
      if (token) {
        const authReq = req.clone({
          headers: req.headers.set('authorization', token)
        });
        return next.handle(authReq);
      } else {
        return next.handle(req);
      }
    }
}


/*
@Injectable()
export class GlobalHttpInterceptorService implements HttpInterceptor {

  constructor(
    public router: Router,
    private auth: AuthService
  ) { }

  onAccessDenied() {
    this.router.navigate(['/']);
  }

  onMaliciousAction() {

    if (localStorage.getItem('email') && localStorage.getItem('accessToken')) {
      localStorage.clear();
      this.router.navigate(['/']).then(() => {
        window.location.reload();
        return throwError("Expired credential");
      });

    } else {
      return throwError("Invalid credential");
    }
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      catchError((error) => {

        if (error.status >= 500 && error.status <= 599) {
          this.router.navigate(["serveur-indisponible"]);
          return throwError("The server is not responding");
        } else if (error.status == 403) {
          this.onAccessDenied();
        } else if (error.status == 401) {
          this.onMaliciousAction();
        } else if (error.status == 422) {
          this.onAccessDenied();
        }

        return throwError(error.message);
      })
    )
  }
}
*/
