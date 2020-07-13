import { Injectable } from '@angular/core';
import { ReportRequest } from 'src/app/models/report-request';
import { Subject } from 'rxjs/internal/Subject';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { ReportItem } from 'src/app/models/report-item';

const API_REPORT = '/api/timeline/testsum';

@Injectable({
  providedIn: 'root'
})
export class RepportRequestService {

  constructor(private http: HttpClient) { }

  ngOnInit(): void {}

  getReport(params: ReportRequest): Observable<ReportItem[]>{
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),  // tslint:disable-line:object-literal-key-quotes
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<ReportItem[]>(API_REPORT, params, opts);
  }
}
