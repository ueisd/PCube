import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TimelineItem } from 'src/app/models/timeline';
import { Time } from '@angular/common';

const API_TIMELINE = "/api/timeline";
const API_GET_FILTER = "/api/timeline/filter";

@Injectable({
  providedIn: 'root'
})

export class TimelineService {

  constructor(private http: HttpClient) { }

  addNewTimeline(timelines:TimelineItem[]): Observable<TimelineItem[]>{
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),  
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
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
        'Content-Type' : 'application/json'
      })
    };

    return this.http.get<TimelineItem[]>(url, opts);
  }

  getTimelineById(id:number): Observable<TimelineItem>{
    let url = API_TIMELINE + '/' + id;
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
        'Content-Type' : 'application/json'
      })
    };

    return this.http.get<TimelineItem>(url, opts);
  }

  deleteTimeline(id, day_of_week:string, punch_in:string, punch_out:string){
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),  
      }),
      body :{
        id: id,
        day_of_week: day_of_week,
        punch_in: punch_in,
        punch_out: punch_out
      }
    };

    return this.http.delete(API_TIMELINE, opts);
  }
}
