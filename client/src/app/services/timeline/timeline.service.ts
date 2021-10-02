import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TimelineItem } from 'src/app/models/timeline';
import { TimelineFilterItem } from 'src/app/models/timelineFilter';
import { environment } from 'src/environments/environment';

const API_TIMELINE = environment.api_url + "api/api/timeline";
const API_GET_FILTER = environment.api_url + "/api/timeline/filter";
const API_UNIQUE_VALIDATION = environment.api_url + "/api/timeline/timelines-validation"

@Injectable({
  providedIn: 'root'
})

export class TimelineService {

  constructor(private http: HttpClient) { }

  addNewTimeline(timelines: TimelineItem[]): Observable<TimelineItem[]> {
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

  addNewTimelines(timelines: TimelineItem[]): Observable<TimelineItem[]> {
    let entrys = timelines.map(timeline => {
      return timeline.fetchEntryFromTimeline();
    });
    const body = {
      timelines: entrys
    }

    return this.http.post<TimelineItem[]>(API_TIMELINE, body);
  }

  updateTimelines(timelines: TimelineItem[]): Observable<TimelineItem> {
    let entrys = timelines.map(timeline => {
      return timeline.fetchEntryFromTimeline();
    });
    const body = {
      timelines: entrys
    }
    return this.http.put<TimelineItem>(API_TIMELINE, body);
  }

  //@todo à supprimer
  updateTimeline(timeline: TimelineItem): Observable<TimelineItem> {
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
        'Content-Type': 'application/json'
      })
    };
    let body = {
      id: timeline.id,
      day_of_week: timeline.day_of_week,
      punch_in: timeline.punch_in,
      punch_out: timeline.punch_out,
      project_id: timeline.project_id,
      expense_account_id: timeline.expense_account_id,
      activity_id: timeline.activity_id,
      user_id: timeline.user_id
    }
    return this.http.put<TimelineItem>(API_TIMELINE, body, opts);
  }

  getTimelineByFilter(timelineFilter: TimelineFilterItem): Observable<any[]> {

    let url = API_GET_FILTER + '?day_of_week=' + timelineFilter.day_of_week;
    url += "&expense_name=" + timelineFilter.accounting_time_category_name;
    url += "&activity_name=" + timelineFilter.activity_name;
    url += "&member_name=" + timelineFilter.member_name;
    url += "&project_name=" + timelineFilter.project_name;

    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
        'Content-Type': 'application/json'
      })
    };

    return this.http.get<TimelineItem[]>(url, opts);
  }

  getTimelineById(id: number): Observable<TimelineItem> {
    let url = API_TIMELINE + '/' + id;
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
        'Content-Type': 'application/json'
      })
    };

    return this.http.get<TimelineItem>(url, opts);
  }

  deleteTimelines(idsToDelete:number[]) {
    const opts = {
      headers: new HttpHeaders(),
      body: idsToDelete
    };
    return this.http.delete(API_TIMELINE, opts);
  }

  //@todo supprimer
  deleteTimeline(id, day_of_week: string, punch_in: string, punch_out: string) {
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
      }),
      body: {
        id: id,
        day_of_week: day_of_week,
        punch_in: punch_in,
        punch_out: punch_out
      }
    };

    return this.http.delete(API_TIMELINE, opts);
  }

  validateAllTimeline(timelines: TimelineItem[]): Observable<boolean> {
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
        'Content-Type': 'application/json'
      })
    };
    let body = {
      timelines: timelines
    }
    return this.http.post<boolean>(API_UNIQUE_VALIDATION, body, opts);
  }
}
