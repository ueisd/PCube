import { Component, OnInit, Input } from '@angular/core';
import { ReportRequest } from 'src/app/models/report-request';
import { DateManip } from 'src/app/utils/date-manip';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {
  @Input() reportRequest:ReportRequest;

  constructor() { 
  }

  ngOnInit(): void {}


  afficherDate(d: Date) {
    const montFormater = new Intl.DateTimeFormat('fr', { month: 'long' });
        const weekDayFormater = new Intl.DateTimeFormat('fr', { weekday: 'long' });
        const month1 = montFormater.format(d);
        const weekday = weekDayFormater.format(d);
        let jour = d.getDate() + "";
        if(d.getDate() == 1) jour += 'er';
        return weekday + ' le ' + jour + " " + month1 + " " + d.getFullYear();
  }

  afficherPeriodes() {
    let chaineAff = '';
    let dateDebut = this.reportRequest.dateDebut;
    let dateFin = this.reportRequest.dateFin;
    if(dateDebut == '' && dateFin == ''){
      chaineAff += 'Sans limite de période';
    }else{
      chaineAff += 'Pour la période';
      if (dateDebut != ''){
        chaineAff += ' commencant le ' + " " + this.afficherDate(DateManip.chaineToDate(dateDebut));
      }
      if(dateFin != ''){
        if(dateDebut != '') chaineAff += ' et';
        chaineAff += ' se terminant le ' + this.afficherDate(DateManip.chaineToDate(dateFin));
      }
    }
    chaineAff += '.';
    return chaineAff;
  }

}
