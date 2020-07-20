import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/models/user';
import { MatDialog } from '@angular/material/dialog';
import { ActivityItem } from 'src/app/models/activity';
import { ProjectItem } from 'src/app/models/project';
import { WorkingShift } from 'src/app/models/working-shift';
import { ExpenseAccountItem } from 'src/app/models/expense-account';
import { TimelineItem } from 'src/app/models/timeline';
import { TimelineService } from 'src/app/services/timeline/timeline.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AddTimelineStep1Component } from '../add-timeline/add-timeline-step1/add-timeline-step1.component';
import { AddTimelineStep2Component } from '../add-timeline/add-timeline-step2/add-timeline-step2.component';
import { AddTimelineStep3Component } from '../add-timeline/add-timeline-step3/add-timeline-step3.component';
import { AddTimelineStep4Component } from '../add-timeline/add-timeline-step4/add-timeline-step4.component';
import { AddTimelineStep5Component } from '../add-timeline/add-timeline-step5/add-timeline-step5.component';
import { Shift } from 'src/app/models/shift';

@Component({
  selector: 'app-modify-timeline',
  templateUrl: './modify-timeline.component.html',
  styleUrls: ['./modify-timeline.component.css']
})
export class ModifyTimelineComponent implements OnInit {

  
  @ViewChild('memberChild') memberComponent:AddTimelineStep1Component;
  @ViewChild('projectChild') projectComponent:AddTimelineStep2Component;
  @ViewChild('activityChild') activityComponent:AddTimelineStep3Component;
  @ViewChild('expenseChild') expenseComponent:AddTimelineStep4Component;
  @ViewChild('timelineChild') timelineComponent:AddTimelineStep5Component;

  constructor(
    private timelineService: TimelineService,
    private snackBar : MatSnackBar,
    private router: Router
  ) { }
 
  ngOnInit(): void {
  }

  isReadyToSubmit:boolean = false;

  step1:boolean = false;
  step2:boolean = false;
  step3:boolean = false;
  step4:boolean = false;
  step5:boolean = false;

  user:User;
  activity:ActivityItem;
  project:ProjectItem;
  account:ExpenseAccountItem;
  workingShifts: WorkingShift[];

  dateFormatISO8601(date:Date): string{

    let iso = date.toISOString();
    let index = iso.indexOf('T');
    iso = iso.substr(0, index);

    return iso;
  }

  generateTimelineFromSubmit() : TimelineItem{

    let timeline:TimelineItem = new TimelineItem();

    timeline.id = this.timeline.id;
    timeline.user_id = this.user.id;
    timeline.project_id = this.project.id;
    timeline.activity_id = this.activity.id;
    timeline.expense_account_id = this.account.id;
    timeline.day_of_week = this.dateFormatISO8601(this.workingShifts[0].date);
    timeline.punch_in = this.workingShifts[0].shift[0].begin;
    timeline.punch_out = this.workingShifts[0].shift[0].end;

    return timeline;
  }

  onCancel(){
    this.openSnackBar('Modification annulée','notif-success');
    this.router.navigate(['gestion-des-lignes-de-temps']);
  }

  onSubmit(){

    let timesLine = this.generateTimelineFromSubmit();
    this.timelineService.updateTimeline(timesLine).subscribe( timelines => {

      this.openSnackBar('Les lignes de temps ont été ajouté','notif-success');
      this.router.navigate(['gestion-des-lignes-de-temps']);

    }, error =>{
      this.openSnackBar("Une erreur s'est produit. Veuillez réessayer.",'notif-error');
    });

  }

  setUser(user:User){
    this.user = user;
  }

  setActivity(activity:ActivityItem){
    this.activity = activity;
  }

  setProject(project:ProjectItem){
    this.project = project;
  }

  setExpenseAccount(account:ExpenseAccountItem){
    this.account = account;
  }

  setWorkingShift(timelines:WorkingShift[]){
    this.workingShifts = timelines;
  }

  onChildStateChange(stepNumber, isValid){
    switch(stepNumber){
      case 1:this.step1 = isValid;break;
      case 2:this.step2 = isValid;break;
      case 3:this.step3 = isValid;break;
      case 4:this.step4 = isValid;break;
      case 5:this.step5 = isValid;break;
    }
    this.isReadyToSubmit = this.step1 && this.step2 && this.step3 && this.step4 && this.step5;
  }

  openSnackBar(message, panelClass) {
    this.snackBar.open(message, 'Fermer', {
      duration: 10000,
      horizontalPosition: "right",
      verticalPosition: "bottom",
      panelClass: [panelClass]
    });
  }

  generateDateFromISO6801(date:string):Date{
    let splitDate = date.split('-');
    return new Date(parseInt(splitDate[0]), parseInt(splitDate[1]) - 1, parseInt(splitDate[2]));
  }

  initChildren(timeline:TimelineItem){
    this.memberComponent.setAlreadyFoundItem(false, timeline.user_id.toString());
    this.projectComponent.setAlreadyFoundItem(false, timeline.project_id.toString());
    this.activityComponent.setAlreadyFoundItem(false, timeline.activity_id.toString());
    this.expenseComponent.setAlreadyFoundItem(false, timeline.expense_account_id.toString());

    let workingShift = new WorkingShift(this.generateDateFromISO6801(timeline.day_of_week));
    let shift = new Shift(timeline.punch_in, timeline.punch_out);
    workingShift.addShift(shift);
    this.timelineComponent.setGeneratedValue(workingShift, false);
  }

  timeline:TimelineItem;

  fetchTimeline(id:number){
    this.timelineService.getTimelineById(id).subscribe(timeline =>{
      this.timeline = timeline;
      this.initChildren(timeline);
    },error =>{
      this.router.navigate(['gestion-des-lignes-de-temps']);
    });
  }

  setTimelineId(id:number){
    this.fetchTimeline(id);
  }

}
