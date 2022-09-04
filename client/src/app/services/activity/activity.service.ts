import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ActivityItem } from 'src/app/models/activity';

const API_ACTIVITY = environment.api_url + '/api/activity';
const API_IS_NAME_EXIST = API_ACTIVITY + '/is-name-exist';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  constructor(private http: HttpClient) {}

  getAllActivity(): Observable<ActivityItem[]> {
    return this.http.get<ActivityItem[]>(API_ACTIVITY);
  }

  isNameExist(name): Observable<boolean> {
    return this.http.post<boolean>(API_IS_NAME_EXIST, { name });
  }

  addNewActivity(name): Observable<ActivityItem> {
    return this.http.post<ActivityItem>(API_ACTIVITY, {
      name,
    });
  }

  updateActivity(id, newName): Observable<ActivityItem> {
    return this.http.put<ActivityItem>(API_ACTIVITY, {
      id,
      name: newName,
    });
  }

  deleteActivity(id): Observable<{}> {
    const url = API_ACTIVITY + '/' + id;
    return this.http.delete(url);
  }
}
