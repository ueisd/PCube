import { Injectable } from '@angular/core';
import { ReportRequest } from 'src/app/models/report-request';
import { Subject } from 'rxjs/internal/Subject';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { ReportItem } from 'src/app/models/report-item';
import { ReportRequestForBackend } from 'src/app/models/report-reques-backend';
import { environment } from 'src/environments/environment';
import { TimelineItem } from 'src/app/models/timeline';
import { map } from 'rxjs/operators';

const API_REPORT = environment.api_url + '/api/timeline/testsum';
const API_GET_TIMELINES = environment.api_url + '/api/timeline/getLines';

@Injectable({
  providedIn: 'root'
})
export class RepportRequestService {

  private missionAnnouncedSource = new Subject<ReportRequest>();

  paramsAnnounced$ = this.missionAnnouncedSource.asObservable();

  paramForForm: ReportRequest = new ReportRequest();

  constructor(private http: HttpClient) { }

  ngOnInit(): void {}

  getReport(params: ReportRequestForBackend): Observable<ReportItem[]>{
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),  // tslint:disable-line:object-literal-key-quotes
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<ReportItem[]>(API_REPORT, params, opts);
  }

  getTimelines(params: ReportRequestForBackend): Observable<TimelineItem[]>{
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),  // tslint:disable-line:object-literal-key-quotes
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<TimelineItem[]>(API_GET_TIMELINES, params, opts).pipe(map(
      timelines => timelines.map(
        timeline => {
          return new TimelineItem(timeline);
        }
      )
    ));
  }

  // Service message commands
  emitParams(params: ReportRequest) {
    this.paramForForm = params;
    this.missionAnnouncedSource.next(params);
  }
}
