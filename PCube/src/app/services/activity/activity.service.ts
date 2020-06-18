import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ActivityItem } from 'src/app/components/domain/activity/activity-item/activity';

const API_ALL_ACTIVITY = environment.api_url + "/api/activity/get-all-activity";
const API_IS_UNIQUE = environment.api_url + "/api/activity/is-unique-activity";
const API_ACTIVITY = environment.api_url + "/api/activity/activity";

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
    return this.http.post<ActivityItem>(API_ACTIVITY, body, opts);
  }

  updateActivity(id, name, newName): Observable<ActivityItem>{
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')  // tslint:disable-line:object-literal-key-quotes
      })
    };
    let body = new HttpParams();
    body = body.set('id', id);
    body = body.set('name', name);
    body = body.set('new_name', newName);
    return this.http.put<ActivityItem>(API_ACTIVITY, body, opts);
  }


}
