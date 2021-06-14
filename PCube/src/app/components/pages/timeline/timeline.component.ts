import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReportRequest } from 'src/app/models/report-request';
import { ReportRequestForBackend } from 'src/app/models/report-reques-backend';
import { RepportRequestService } from 'src/app/services/request/repport-request.service';
import { TimelineItem } from 'src/app/models/timeline';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {

  reportRequest : ReportRequest;
  reportRequestBackend : ReportRequestForBackend;
  timelines : TimelineItem[];

  constructor(private router: Router, private reportReqService: RepportRequestService) { }

  ngOnInit(): void { 
    if(history.state.params) {
      this.reportRequest = history.state.params;
      this.refreshRequestBackend(history.state.params);
      this.refreshTimelines();
    }

    this.reportReqService.paramsAnnounced$.subscribe(
      params => {
        this.reportRequest = params;
        this.refreshRequestBackend(params);
        this.refreshTimelines();
      }
    ); 
  }

  refreshTimelines() {
    this.reportReqService.getTimelines(this.reportRequestBackend).subscribe(resTimelines =>{
      this.timelines = resTimelines;
      //this.dataSource.data = reportsI;
      //this.reportsItems = reportsI;
    });
  }

  goToAddNewTimeline(){
    this.router.navigate(['/gestion-des-lignes-de-temps/ajouter-ligne-de-temps']);
  }

  refreshRequestBackend(req: ReportRequest) {
    this.reportRequestBackend = new ReportRequestForBackend();
    this.reportRequestBackend.buildFromReportRequest(req);
  }

}
