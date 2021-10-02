import { Injectable, OnDestroy } from "@angular/core";
import { User } from "../models/user.model";
import { Observable, BehaviorSubject, timer, of, Subscription } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { JwtToken } from "../models/jwt-token.model";
import { tap, switchMap, catchError } from "rxjs/operators";
import { UserService } from "./user.service";
import { CurentUser } from "../models/curent-user.model";
import { CurentUserService } from "./curent-user.service";

@Injectable()
export class AuthService implements OnDestroy{
  private timeRefresToken = 200000; //200 secondes

  public subscription: Subscription;
  public curentUser: CurentUser;
  private jwtSubscription: Subscription; 

  public jwtToken: BehaviorSubject<JwtToken> = new BehaviorSubject({
    isAuthenticated: null,
    expireDate: null,
    token: null,
  });

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private curentUserService: CurentUserService
  ) {
    this.curentUser = new CurentUser();
    this.jwtSubscription = this.jwtToken.subscribe(token => {
      if(token.isAuthenticated) {
        this.curentUserService.getCurentUserFromApi().toPromise().then(user => {
          this.curentUserService.updateCurentUser(user);
        });
      }
    });
    this.initToken();
    this.subscription = this.initTimer();
  }

  public initTimer() {
    return timer(2000, this.timeRefresToken)
      .pipe(
        switchMap(() => {
          if (localStorage.getItem("jwt")) {
            return this.http.get<string>("/api/api/auth/refresh-token").pipe(
              tap((result: any) => {
                console.log("refersh");
                let token = result.token;
                localStorage.setItem("jwt", token);
                this.jwtToken.next({
                  isAuthenticated: true,
                  token: token,
                });
              })
            );
          } else {
            console.log("no token to refresh");
            this.subscription.unsubscribe();
            return of(null);
          }
        })
      )
      .subscribe(
        () => {},
        (err) => {
          this.jwtToken.next({
            isAuthenticated: false,
            token: null,
          });
          localStorage.removeItem("jwt");
          this.subscription.unsubscribe();
        }
      );
  }

  private initToken(): void {
    const token = localStorage.getItem("jwt");
    if (token) {
      this.jwtToken.next({
        isAuthenticated: true,
        token: token,
      });
    } else {
      this.jwtToken.next({
        isAuthenticated: false,
        token: null,
      });
    }
  }

  public signup(user: User): Observable<User> {
    return this.http.post<User>("/api/api/auth/signup", user);
  }



  public signin(credentials: {
    email: string;
    password: string;
  }): Observable<string> {
    return this.http.post<string>("/api/api/auth/signin", credentials).pipe(
      tap((response: any) => {
        let token = response.token;
        localStorage.setItem("jwt", token);
        this.jwtToken.next({
          isAuthenticated: true,
          token: token,
        });
        this.subscription = this.initTimer();
      }),
      catchError(
        this.handleError<string>('aut.signin')
      )
    );
  }

  public logout(): void {
    this.jwtToken.next({
      isAuthenticated: false,
      token: null,
    });
    this.userService.currentUser.next(null);
    localStorage.removeItem("jwt");
  }


  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error("error :::::::::::::::::::");
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  ngOnDestroy() {
    this.jwtSubscription.unsubscribe();
    this.subscription.unsubscribe();
  }

}