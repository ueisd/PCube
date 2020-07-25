// Authentication Service

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError, BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { UserAuth } from 'src/app/models/user-auth';
import { User } from 'src/app/models/user';

const LOGIN_API = environment.api_url + '/api/auth/login';
const LOGOUT_API = environment.api_url + '/api/auth/logout';
const INFO_API = environment.api_url + '/api/auth/info';
const REFRESH_API = environment.api_url + '/api/auth/refresh';
const ACCESS_LEVEL_API = environment.api_url + '/api/auth/access-level';
const AUTH_USER = environment.api_url + '/api/auth/authenticated-user';

class LoginResponse {
  accessToken: string;
  refreshToken: string;
}

class RefreshResponse {
  accessToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private jwt: JwtHelperService = new JwtHelperService();
  private authStatus: BehaviorSubject<boolean> = new BehaviorSubject(this.isAuthenticated());

  constructor(private http: HttpClient) { }

  // Handle authentication errors
  private errorHandler(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error(`authentication error: ${error.error.message}`);
    } else {
      console.error(`bad auth response: ${error.status}: ${error.statusText} ${JSON.stringify(error.error)}`);
    }
    return throwError('Login attempt failed');
  }

  // subscribe to get authentication status updates
  subscribe(next: (status: boolean) => void) {
    this.authStatus.subscribe(next);
  }

  // Log user in and get refresh/access tokens
  authenticate(email: string, password: string) {
    return this.http.post<LoginResponse>(LOGIN_API, { email, password })
      .pipe(
        mergeMap(response => {
          // store JWTs
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);

          // now get user info
          const opts = {
            headers: new HttpHeaders({
              'Authorization': 'Bearer ' + localStorage.getItem('accessToken')  // tslint:disable-line:object-literal-key-quotes
            })
          };
          return this.http.get<UserAuth>(INFO_API, opts).pipe(
            map(userInfo => {
              localStorage.setItem('email', userInfo.email);
              localStorage.setItem('role', userInfo.role);
              this.authStatus.next(true);
            })
          );
        }),
        catchError(this.errorHandler)
      );
  }

  // Log user out, clear stored tokens
  deauthenticate() {
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('refreshToken')  // tslint:disable-line:object-literal-key-quotes
      })
    };
    localStorage.clear();
    this.authStatus.next(false);
    
    return this.http.delete(LOGOUT_API, opts)
      .pipe(
        map(response => null),
        catchError(this.errorHandler)
      );
  }

  // Get access token, automatically refresh if necessary
  getAccessToken(): Observable<string> {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (!this.jwt.isTokenExpired(accessToken)) {
      return new BehaviorSubject(accessToken);
    } else if (!this.jwt.isTokenExpired(refreshToken)) {
      const opts = {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + refreshToken
        })
      };
      return this.http.post<RefreshResponse>(REFRESH_API, {}, opts).pipe(
        map(response => {
          localStorage.setItem('accessToken', response.accessToken);
          return response.accessToken;
        })
      );
    } else {
      return throwError('refresh token is expired');
    }
  }

  // User is logged in
  isAuthenticated(): boolean {
    return localStorage.getItem('email') !== null &&
           localStorage.getItem('role') !== null &&
           !this.jwt.isTokenExpired(localStorage.getItem('refreshToken'));
  }

  getAccessLevel(): Observable<UserAuth>{
    // now get user info
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')  // tslint:disable-line:object-literal-key-quotes
      })
    };
    return this.http.get<UserAuth>(INFO_API, opts);
  }

  getAuthenticatedUser(): Observable<User> {
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')  // tslint:disable-line:object-literal-key-quotes
      })
    }
    return this.http.get<User>(AUTH_USER, opts);
  }

  // User is an administrator
  isAdmin(): boolean {
    return localStorage.getItem('role') === 'admin';
  }

  // User is a project manager
  isProjectManager(): boolean {
    return localStorage.getItem('role') === 'project_manager'
  }

  isMember(): boolean {
    return localStorage.getItem('role') === 'member'
  }

  // get email
  getemail(): string {
    return localStorage.getItem('email');
  }
}
