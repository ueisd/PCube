import { Component, OnInit, AfterViewInit, AfterContentInit, Optional, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ProjectService } from 'src/app/services/project/project.service';
import { ProjectItem } from 'src/app/models/project';
import { ActivityService } from 'src/app/services/activity/activity.service';
import { ActivityItem } from 'src/app/models/activity';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/models/user';
import { formatDate } from "@angular/common";
import { ErrorStateMatcher } from '@angular/material/core';
import { Router, NavigationExtras } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RepportRequestService } from 'src/app/services/request/repport-request.service';
import { ReportRequest } from 'src/app/models/report-request';
import { DateManip } from 'src/app/utils/date-manip';

const format = 'yyyy-MM-dd';
const locale = 'en-US';

@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.css']
})
export class RequestFormComponent implements OnInit, AfterContentInit {

  requestForm: FormGroup;
  projetsOptions: ProjectItem[];
  activityOptions: ActivityItem[];
  usersOptions: User[];
  matcher = new MyErrorStateMatcher();

  params = new ReportRequest();

  isMember : boolean;
  member : User;

  isProjets(checked: boolean) {
    if(!checked) this.requestForm.get('projects').reset();
  }

  isActivitys(checked: boolean) {
    if(!checked) this.requestForm.get('activitys').reset();
  }

  isUsers(checked: boolean) {
    if(!checked) this.requestForm.get('users').reset();
  }

  constructor(private fb: FormBuilder, private projectService: ProjectService,
    private activityService: ActivityService, private router: Router,
    private dialogRef: MatDialogRef<RequestFormComponent>,
    private reportReqService: RepportRequestService,
    private userService: UserService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) { 
      if(data.user.access_level == 3) {
        this.isMember = true;
      }
    }

  ngOnInit(): void {
    this.initForm();
    
    this.params = this.reportReqService.paramForForm;

    this.projectService.getApparentableProject(-1).subscribe(projets =>{
      this.projetsOptions = this.projectService.generateParentOption(projets, 0);
      this.requestForm.controls['projects'].setValue(this.params.projects);
      if(this.params.projects.length && this.params.projects.length > 0)
        this.requestForm.controls['isProjets'].setValue(true);
    });

    this.activityService.getAllActivity().subscribe(activitys =>{
      this.activityOptions = activitys;
      this.requestForm.controls['activitys'].setValue(this.params.activitys);
      if(this.params.activitys.length && this.params.activitys.length > 0)
        this.requestForm.controls['isActivitys'].setValue(true);
    });

    if(!this.isMember) {
      this.userService.getAllUser().subscribe(users =>{
        this.usersOptions = users;
        for(let user of this.usersOptions) {
          user.display_string = user.first_name + " " + user.last_name;
        }
        this.requestForm.controls['users'].setValue(this.params.users);
        if(this.params.users.length && this.params.users.length > 0)
          this.requestForm.controls['isUsers'].setValue(true);
      });
    } else {
      this.userService.getUser(new User({"email" : this.data.user.email})).subscribe((data) => {
        this.member = data;
        this.member.display_string = this.member.first_name + " " + this.member.last_name;
        this.requestForm.controls['users'].setValue(this.member.display_string);
      });
    }

    if(this.params.dateDebut != "")
      this.requestForm.controls['dateDebut'].setValue(DateManip.chaineToDate(this.params.dateDebut));
    if(this.params.dateFin != "")
      this.requestForm.controls['dateFin'].setValue(DateManip.chaineToDate(this.params.dateFin));
  }

  ngAfterContentInit(): void {
    if(this.isMember) {
      this.setMemberParameters();
    }
  }

  private initForm(){
    this.requestForm = this.fb.group(
      {
        projectName: [
          '',
          Validators.compose([
            Validators.minLength(5)
          ]),
          []
        ],
        isProjets: [
          false
        ],
        isActivitys: [
          false
        ],
        isUsers: [
          false
        ],
        projects: [
          null,
          Validators.compose([]),
          []
        ],
        activitys: [
          null,
          Validators.compose([]),
          []
        ],
        users: [
          null,
          Validators.compose([]),
          []
        ],
        dateDebut: [
          null,
          Validators.compose([]),
          []
        ],
        dateFin: [
          null,
          Validators.compose([]),
          []
        ],
      },
      {validators: this.DateRangeValidator}
    );
  }

  DateRangeValidator: ValidatorFn = (fg: FormGroup) => {
    const start = fg.get('dateDebut').value;
    const end = fg.get('dateFin').value;
    
    if(start && end) {
      let formattedDebut = formatDate(start, format, locale);
      let formattedEnd = formatDate(end, format, locale);
      if(formattedEnd < formattedDebut)
        return { dateFinAvantDebut: true };
    }
    return null;
  };

  setMemberParameters() {
    this.requestForm.controls['users'].disable();
    this.requestForm.controls['isUsers'].setValue(true);
  }
 
  onSubmit() {
    let dateDeb = this.requestForm.controls['dateDebut'].value;
    if(dateDeb) this.params.dateDebut = formatDate(dateDeb, format, locale);
    else this.params.dateDebut = "";

    let dateFin = this.requestForm.controls['dateFin'].value;
    if(dateFin) this.params.dateFin = formatDate(dateFin, format, locale);
    else this.params.dateFin = "";

    if(this.requestForm.controls['projects'].value)
      this.params.projects = this.requestForm.controls['projects'].value;

    if(this.requestForm.controls['activitys'].value)
      this.params.activitys = this.requestForm.controls['activitys'].value;

    if(!this.isMember) {
      if(this.requestForm.controls['users'].value)
        this.params.users = this.requestForm.controls['users'].value;
    } else {
      this.params.users.pop();
      this.params.users.push(this.member);
    }

    this.reportReqService.emitParams(this.params);
    this.dialogRef.close(this.params);
  }

}


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid);
    const invalidParent = !!(control && control.parent && control.parent.invalid);

    return (invalidCtrl || invalidParent);
  }
}
