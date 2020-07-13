import { Component, OnInit } from '@angular/core';
import { RepportRequestService } from 'src/app/services/request/repport-request.service';
import { ReportRequest } from 'src/app/models/report-request';
import { ReportItem } from 'src/app/models/report-item';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  reportRequest : ReportRequest;
  reportsItems: ReportItem[];

  constructor(private reportReqService: RepportRequestService, private router: Router) {
    
  }

  ngOnInit(): void {
    this.reportRequest = history.state.params;
    this.reportReqService.getReport(this.reportRequest).subscribe(reportsI =>{
      this.reportsItems = reportsI;
    });
  }

}
