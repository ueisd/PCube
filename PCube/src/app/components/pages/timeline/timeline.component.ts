import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ReportRequest } from 'src/app/models/report-request';
import { ReportRequestForBackend } from 'src/app/models/report-reques-backend';
import { RepportRequestService } from 'src/app/services/request/repport-request.service';
import { TimelineItem } from 'src/app/models/timeline';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivityService } from 'src/app/services/activity/activity.service';
import { ActivityItem } from 'src/app/models/activity';
import { Observable, Subject } from 'rxjs';
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

  // activitées
  private activitysSource = new Subject<ActivityItem[]>();
  activitysAnnounced$ = this.activitysSource.asObservable();
  activityOptions: ActivityItem[] = null;

  // Projets
  private projectsSource = new Subject<ProjectItem[]>();
  projectsAnnounced$ = this.projectsSource.asObservable();
  projectsOptions: ProjectItem[] = null;

  // Comptes
  private comptesSource = new Subject<ExpenseAccountItem[]>();
  comptesAnnounced$ = this.comptesSource.asObservable();
  comptesOptions: ExpenseAccountItem[] = null;

  // utilisateurs
  private userSource = new Subject<User[]>();
  usersAnnounced$ = this.userSource.asObservable();
  usersOptions: User[] = null;

  displayedColumns = ['day_of_week', 'punch_in', 'punch_out', 'activity_id', /*'project_id',*/ 'expense_account_id'/*, 'user_id'*/];

  constructor(
    private router: Router,
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

  ngOnInit(): void { 

    this.activityService.getAllActivity().subscribe(activitys =>{
      console.log("subscribe(activitys");
      this.activityOptions = activitys;
      this.activitysSource.next(this.activityOptions);
    });

    this.projectService.getApparentableProject(-1).subscribe(projets =>{
      console.log("subscribe(projets");
      this.projectsOptions = this.projectService.generateParentOption(projets, 0)
      this.projectsSource.next(this.projectsOptions);
    });

    this.expenseAccountServices.getAllExpenseAccount().subscribe(comptes => {
      console.log("subscribe(comptes");
      this.comptesOptions = this.expenseAccountServices.generateParentOption(comptes, 0);
      this.comptesSource.next(this.comptesOptions);
    });

    this.userService.getAllUser().subscribe(users => {
      console.log("subscribe(users");
      this.usersOptions = users;
      this.userSource.next(this.usersOptions);
    });

    this.form = this._formBuilder.group({
      timelinesGr: this._formBuilder.array([])
    });

    if(history.state.params) {
      console.log('essai recharge history.state.params');

      this.reportRequest = history.state.params;
      this.refreshRequestBackend(history.state.params);
      this.refreshTimelines();
    }

    this.reportReqService.paramsAnnounced$.subscribe(
      params => {
        console.log('essai paramsAnnounced');
        this.reportRequest = params;
        this.refreshRequestBackend(params);
        this.refreshTimelines();
      }
    );
  }

  deleteTimeline(index) {
    let control = <FormArray>this.form.controls.timelinesGr;
    control.removeAt(index);
    this.table.renderRows();
  }

  addLineItem() {
    let timeline = new TimelineItem();
    timeline.day_of_week = "2029-01-01";

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

  refreshTimelines = async () => {
    console.log("Requête refreshTimelines()" + JSON.stringify(this.reportRequestBackend));
    this.timelines = await this.reportReqService.getTimelines(this.reportRequestBackend).toPromise();
    console.log("await this.timelines");
    if(this.activityOptions == null) this.activityOptions = await this.activitysAnnounced$.toPromise();
    console.log("await this.activityOptions");
    if(this.projectsOptions == null) this.projectsOptions = await this.projectsAnnounced$.toPromise();
    console.log("await this.projectsOptions");
    if(this.usersOptions == null) this.usersOptions = await this.usersAnnounced$.toPromise();
    console.log("await this.usersOptions");
    if(this.comptesOptions == null) this.comptesOptions = await this.comptesAnnounced$.toPromise();
    console.log("await this.comptesOptions");
    console.log("chargé")!

    const fgs = this.timelines.map(
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

  /*goToAddNewTimeline(){
    this.router.navigate(['/gestion-des-lignes-de-temps/ajouter-ligne-de-temps']);
  }*/

  refreshRequestBackend(req: ReportRequest) {
    this.reportRequestBackend = new ReportRequestForBackend();
    this.reportRequestBackend.buildFromReportRequest(req);
  }

}
