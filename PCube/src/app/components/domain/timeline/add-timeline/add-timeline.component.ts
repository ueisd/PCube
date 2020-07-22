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
import { AddTimelineStep5Component } from './add-timeline-step5/add-timeline-step5.component';
import { Router } from '@angular/router';
import { CustomSnackBar } from 'src/app/utils/custom-snackbar';

@Component({
  selector: 'app-add-timeline',
  templateUrl: './add-timeline.component.html',
  styleUrls: ['./add-timeline.component.css']
})
export class AddTimelineComponent implements OnInit {

  @ViewChild('step5') step5Component: AddTimelineStep5Component;

  constructor(
    private dialog: MatDialog,
    private timelineService: TimelineService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {

  }

  step1: boolean = false;
  step2: boolean = false;
  step3: boolean = false;
  step4: boolean = false;
  step5: boolean = false;

  isReadyToSubmit: boolean = false;

  user: User;
  activity: ActivityItem;
  project: ProjectItem;
  account: ExpenseAccountItem;
  workingShifts: WorkingShift[];

  customSnackBar: CustomSnackBar = new CustomSnackBar(this.snackBar)

  dateFormatISO8601(date: Date): string {

    let iso = date.toISOString();
    let index = iso.indexOf('T');
    iso = iso.substr(0, index);

    return iso;
  }

  generateTimelinesFromSubmit(isForValidationOnly:boolean): TimelineItem[] {

    let timelines: TimelineItem[] = [];

    this.workingShifts.forEach(workingShift => {
      workingShift.shift.forEach(shift => {
        let timeline = new TimelineItem();
        timeline.user_id = this.user.id;
        timeline.day_of_week = this.dateFormatISO8601(workingShift.date);
        timeline.punch_in = shift.begin;
        timeline.punch_out = shift.end;

        if(!isForValidationOnly){
          timeline.project_id = this.project.id;
          timeline.activity_id = this.activity.id;
          timeline.accounting_time_category_id = this.account.id;
        }

        timelines.push(timeline);
      });
    });

    return timelines;
  }

  submit() {

    let timesLines = this.generateTimelinesFromSubmit(false);
    this.timelineService.addNewTimeline(timesLines).subscribe(timelines => {

      this.customSnackBar.openSnackBar('Les lignes de temps ont été ajouté', 'notif-success');
      this.step5Component.onFormSubmitSuccess();

    }, error => {
      this.customSnackBar.openSnackBar("Une erreur s'est produit. Veuillez réessayer.", 'notif-error');
    });

  }

  onCancel() {
    this.router.navigate(['gestion-des-lignes-de-temps']);
  }

  setUser(user: User) {
    if(user == undefined && this.step5)
      this.step5Component.awaitingWorkingShiftValidation(false, "Sélectionner un utilisateur.");

    this.user = user; 
  }

  setActivity(activity: ActivityItem) {
    this.activity = activity;
  }

  setProject(project: ProjectItem) {
    this.project = project;
  }

  setExpenseAccount(account: ExpenseAccountItem) {
    this.account = account;
  }

  setWorkingShift(timelines: WorkingShift[]) {
    this.workingShifts = timelines;
  }

  onChildStateChange(stepNumber, isValid) {
    switch (stepNumber) {
      case 1: this.step1 = isValid; break;
      case 2: this.step2 = isValid; break;
      case 3: this.step3 = isValid; break;
      case 4: this.step4 = isValid; break;
      case 5: this.step5 = isValid; break;
    }
    this.isReadyToSubmit = this.step1 && this.step2 && this.step3 && this.step4 && this.step5;
  }

  answeringForWorkingShiftValidation($event) {

    if(this.user == undefined || this.user.id == undefined){
      this.step5Component.awaitingWorkingShiftValidation(false, "Sélectionner un utilisateur");
      return;
    }

    let timesLines = this.generateTimelinesFromSubmit(true);
    this.timelineService.validateAllTimeline(timesLines).subscribe(isValid => {
      this.step5Component.awaitingWorkingShiftValidation(true);
    }, error => {
      this.step5Component.awaitingWorkingShiftValidation(false, "Ligne de temps déjà existante.");
    });
  }

}
