import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor,HttpRequest,HttpResponse,HttpErrorResponse} from '@angular/common/http';
import {Observable, of, throwError} from "rxjs";
import {catchError, map} from 'rxjs/operators';
import { Router } from '@angular/router';
 
@Injectable()
export class GlobalHttpInterceptorService implements HttpInterceptor {
    
  constructor(public router: Router) {
  }
 
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
 
    return next.handle(req).pipe(
      catchError((error) => {
        
        if(error.status >= 500 && error.status <= 599){
            this.router.navigate(["serveur-indisponible"]);
            return throwError("The server is not responding");
        }

        return throwError(error.message);
      })
    )
  }
}