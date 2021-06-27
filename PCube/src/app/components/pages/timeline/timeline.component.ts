import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportRequest } from 'src/app/models/report-request';
import { ReportRequestForBackend } from 'src/app/models/report-reques-backend';
import { RepportRequestService } from 'src/app/services/request/repport-request.service';
import { TimelineItem } from 'src/app/models/timeline';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivityService } from 'src/app/services/activity/activity.service';
import { ActivityItem } from 'src/app/models/activity';
import { ProjectItem } from 'src/app/models/project';
import { ProjectService } from 'src/app/services/project/project.service';
import { ExpenseAccountService } from 'src/app/services/expense-account/expense-account.service';
import { ExpenseAccountItem } from 'src/app/models/expense-account';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})

export class TimelineComponent implements OnInit {
  form: FormGroup;
  reportRequest : ReportRequest;
  reportRequestBackend : ReportRequestForBackend;
  timelines : TimelineItem[];
  @ViewChild('table') table: MatTable<Element>;

  // Options
  activityOptions: ActivityItem[] = null;
  projectsOptions: ProjectItem[] = null;
  comptesOptions: ExpenseAccountItem[] = null;
  usersOptions: User[] = null;

  displayedColumns = ['day_of_week', 'punch_in', 'punch_out', 'expense_account_id', 'activity_id', 'operations'];

  constructor(
    private reportReqService: RepportRequestService,
    private projectService: ProjectService,
    private expenseAccountServices: ExpenseAccountService,
    private activityService: ActivityService,
    private userService: UserService,
    private _formBuilder: FormBuilder
    ) { }

  get timelinesGr(): FormArray {
    return this.form.get('timelinesGr') as FormArray;
  }


  async ngOnInit() { 

    this.form = this._formBuilder.group({
      timelinesGr: this._formBuilder.array([])
    });

    [
      this.activityOptions, 
      this.projectsOptions, 
      this.comptesOptions, 
      this.usersOptions
    ] = await Promise.all([
      <Promise<any>>this.activityService.getAllActivity().toPromise(), 
      <Promise<any>>this.projectService.getParentOptions(-1).toPromise(), 
      <Promise<any>>this.expenseAccountServices.getExpensesAccountOptions().toPromise(),
      <Promise<any>>this.userService.getAllUser().toPromise()
    ]);

    if(history.state.params) this.refreshTimelinesListAndForm(history.state.params);

    this.reportReqService.paramsAnnounced$.subscribe(
      params => this.refreshTimelinesListAndForm(params)
    );
  }

  async refreshTimelinesListAndForm(req : ReportRequest) {
    this.reportRequest = req;
    this.reportRequestBackend = ReportRequestForBackend.buildFromReportRequest(req);
    this.timelines = await this.reportReqService.getTimelines(this.reportRequestBackend).toPromise();
    this.refreshTimelinesForm(this.timelines);
  }

  refreshTimelinesForm = async (timelines: TimelineItem[]) => {
    const fgs = timelines.map(
      elem => TimelineItem.asFormGroup(
        elem, 
        this.activityOptions, 
        this.projectsOptions, 
        this.comptesOptions, 
        this.usersOptions
      )
    );
    this.form.setControl('timelinesGr', new FormArray(fgs));
  }

              // fonctions d'interraction

  deleteFormTimeline(index) {
    let control = <FormArray>this.form.controls.timelinesGr;
    control.removeAt(index);
    this.table.renderRows();
  }

  addFormTimeline() {
    let timeline = new TimelineItem();
    timeline.day_of_week = "2029-01-01"; // @todo mettre la date actuelle sous ce format

    let fgTime = TimelineItem.asFormGroup(
      timeline, 
      this.activityOptions, 
      this.projectsOptions, 
      this.comptesOptions, 
      this.usersOptions
    );
    let control = <FormArray>this.form.controls.timelinesGr;
    control.insert(0, fgTime);
    this.table.renderRows();
  }

}
