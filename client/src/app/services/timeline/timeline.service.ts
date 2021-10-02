import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TimelineItem } from 'src/app/models/timeline';
import { environment } from 'src/environments/environment';

const API_TIMELINE = environment.api_url + "api/api/timeline";

@Injectable({
  providedIn: 'root'
})

export class TimelineService {

  constructor(private http: HttpClient) { }

  addNewTimelines(timelines: TimelineItem[]): Observable<TimelineItem[]> {
    let entrys = timelines.map(timeline => 
      timeline.fetchEntryFromTimeline()    
    );
    return this.http.post<TimelineItem[]>(API_TIMELINE, {
      timelines: entrys
    });
  }

  updateTimelines(timelines: TimelineItem[]): Observable<TimelineItem> {
    let entrys = timelines.map(timeline =>
      timeline.fetchEntryFromTimeline()
    );
    return this.http.put<TimelineItem>(API_TIMELINE, {
      timelines: entrys
    });
  }

  deleteTimelines(idsToDelete:number[]) {
    const opts = {
      headers: new HttpHeaders(),
      body: idsToDelete
    };
    return this.http.delete(API_TIMELINE, opts);
  }
}
