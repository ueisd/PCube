import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TimelineItem } from 'src/app/models/timeline';

const API_TIMELINE = "/api/timeline";
const API_GET_FILTER = "/api/timeline/filter";

@Injectable({
  providedIn: 'root'
})

export class TimelineService {

  constructor(private http: HttpClient) { }

  addNewProject(timelines:TimelineItem[]): Observable<TimelineItem[]>{
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),  // tslint:disable-line:object-literal-key-quotes
        'Content-Type': 'application/json'
      })
    };
    let body = {
        timelines: timelines
    }
    return this.http.post<TimelineItem[]>(API_TIMELINE, body, opts);
  }

  getTimelineByFilter(timeline:TimelineItem): Observable<any[]>{
    let url = API_GET_FILTER;
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')  // tslint:disable-line:object-literal-key-quotes
      })
    };

    return this.http.get<TimelineItem[]>(url, opts);
  }
}
