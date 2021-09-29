import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ActivityItem } from 'src/app/models/activity';

const API_ALL_ACTIVITY = environment.api_url + "api/api/activity";
const API_IS_UNIQUE = environment.api_url + "api/api/activity/is-name-unique";
const API_ACTIVITY = environment.api_url + "api/api/activity";
const API_FILTER_BY_NAME = environment.api_url + "/api/activity/filter"

@Injectable({
  providedIn: 'root'
})

export class ActivityService {

  constructor(private http: HttpClient) { }

  getAllActivity(): Observable<ActivityItem[]>{
    return this.http.get<ActivityItem[]>(API_ALL_ACTIVITY);
  }

  isNameUnique(name, activityId): Observable<boolean> {
    let body = {
      name: name,
      activityId: activityId
    }
    return this.http.post<boolean>(API_IS_UNIQUE, body);
  }

  addNewActivity(name): Observable<ActivityItem>{
    let body = {
      name: name
    }
    return this.http.post<ActivityItem>(API_ACTIVITY, body);
  }

  updateActivity(id, newName): Observable<ActivityItem>{
    let body = {
      id: id,
      name: newName,
    }
    return this.http.put<ActivityItem>(API_ACTIVITY, body);
  }

  deleteActivity(id): Observable<{}> {
    var url = API_ACTIVITY + "/" + id
    return this.http.delete(url);
  }

  filterActivity(activity: ActivityItem): Observable<ActivityItem[]>{
    let url = API_FILTER_BY_NAME + "?name=" + activity.name;
    url += "&id=" + activity.id;
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')  // tslint:disable-line:object-literal-key-quotes
      })
    };
    return this.http.get<ActivityItem[]>(url, opts);
  }


}
