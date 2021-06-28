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
import { TimelineService } from 'src/app/services/timeline/timeline.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})

export class TimelineComponent implements OnInit {
  form: FormGroup;
  reportRequest : ReportRequest;
  reportRequestBackend : ReportRequestForBackend;
  timelines : TimelineItem[] = [];
  @ViewChild('table') table: MatTable<Element>;


  timelinesSubscription: Subscription;

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
    private timelineService: TimelineService,
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
    
    
    this.timelinesSubscription = this.reportReqService.paramsAnnounced$.subscribe(
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
    if(this.table) this.table.renderRows();
  }

              // fonctions d'interraction

  deleteFormTimeline(index) {
    let control = <FormArray>this.form.controls.timelinesGr;
    control.removeAt(index);
    this.table.renderRows();
  }
  addFormTimeline() {
    let timeline = new TimelineItem();
    timeline.day_of_week = "2020-01-01"; // @todo mettre la date actuelle sous ce format

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

  async saveTimelines() {
    let loadedTimelinesIds = this.timelines.map(timeline => timeline.id);
    let timelines = <TimelineItem[]>this.form.value.timelinesGr.map(
      timeline => TimelineItem.builFromFormGroup(timeline)
    );
    let timelinesids = timelines.map(timeline => timeline.id);

    let newTimelines = timelines.filter(timeline => timeline.id < 1);
    let modifiedTimelines = timelines.filter(timeline => timeline.isChanged && !(timeline.id<1));
    let deletedTimelinesids = loadedTimelinesIds.filter(n => !timelinesids.includes(n));
    if(deletedTimelinesids.length>0) await this.timelineService.deleteTimelines(deletedTimelinesids).toPromise();
    if(modifiedTimelines.length>0) await this.timelineService.updateTimelines(modifiedTimelines).toPromise();
    if(newTimelines.length>0) await this.timelineService.addNewTimelines(newTimelines).toPromise();

    this.timelines = await this.reportReqService.getTimelines(this.reportRequestBackend).toPromise();
    this.refreshTimelinesForm(this.timelines);
  }

  ngOnDestroy() {
    this.timelinesSubscription.unsubscribe();
  }

}
