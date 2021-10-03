import { Injectable } from '@angular/core';
import { ReportRequest } from 'src/app/models/report-request';
import { Subject } from 'rxjs/internal/Subject';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { ReportItem } from 'src/app/models/report-item';
import { ReportRequestForBackend } from 'src/app/models/report-reques-backend';
import { environment } from 'src/environments/environment';
import { TimelineItem } from 'src/app/models/timeline';
import { map } from 'rxjs/operators';
import * as moment from 'moment-timezone';

const API_TIMELINE = environment.api_url + 'api/timeline';
const API_TIMELINE_REPORT = API_TIMELINE + '/report';
const API_GET_TIMELINES = API_TIMELINE + '/getLines';

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
    let paramsReq:any = params;
    if(params.dateDebut) {
      paramsReq.debut = this.fetchPunchFromDateTzNY(
        params.dateDebut.toString(), " 00:00:00"
      );
    }
    if(params.dateFin) {
      paramsReq.fin = this.fetchPunchFromDateTzNY(
        params.dateFin.toString(), " 23:59:59"
      );
    }
    return this.http.post<ReportItem[]>(API_TIMELINE_REPORT, params);
  }

  fetchPunchFromDateTzNY(day1, min) {
    let timezone = "America/New_York";
    return (day1) ? moment.tz(day1 + " " + min, timezone).unix(): null;
}

  getTimelines(params: ReportRequestForBackend): Observable<TimelineItem[]>{
    // doit convertir dateDebut et dateFin

    let paramsReq:any = params;
    if(params.dateDebut) {
      paramsReq.debut = this.fetchPunchFromDateTzNY(
        params.dateDebut.toString(), " 00:00:00"
      );
    }
    if(params.dateFin) {
      paramsReq.fin = this.fetchPunchFromDateTzNY(
        params.dateFin.toString(), " 23:59:59"
      );
    }
    
    return this.http.post<any[]>(API_GET_TIMELINES, paramsReq).pipe(map(
      itemsResponse => itemsResponse.map(
        item => TimelineItem.fetchTimelineFromResponse(item)
      )
    ));
  }

  // Service message commands
  emitParams(params: ReportRequest) {
    this.paramForForm = params;
    this.missionAnnouncedSource.next(params);
  }
}
