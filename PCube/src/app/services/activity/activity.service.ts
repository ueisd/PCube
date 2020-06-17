import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { throwError, BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { ActivityItem } from 'src/app/components/domain/activity/activity-item/activity';

const API_ALL_ACTIVITY = environment.api_url + "/api/project/get-all-activity";
const API_IS_UNIQUE = environment.api_url + "/api/project/is-unique-activity";
const API_ADD_ACTIVITY = environment.api_url + "/api/project/add-new-activity";

@Injectable({
  providedIn: 'root'
})

export class ActivityService {

  constructor(private http: HttpClient) { }

  getAllActivity(): Observable<ActivityItem[]>{
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')  // tslint:disable-line:object-literal-key-quotes
      })
    };
    return this.http.get<ActivityItem[]>(API_ALL_ACTIVITY, opts);
  }

  isNameUnique(name): Observable<boolean> {

    var url = API_IS_UNIQUE + "/" + name
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')  // tslint:disable-line:object-literal-key-quotes
      })
    };
    return this.http.get<boolean>(url, opts);
  }

  addNewActivity(name): Observable<ActivityItem>{
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')  // tslint:disable-line:object-literal-key-quotes
      })
    };
    let body = new HttpParams();
    body = body.set('name', name);
    return this.http.post<ActivityItem>(API_ADD_ACTIVITY, body, opts);
  }


}
