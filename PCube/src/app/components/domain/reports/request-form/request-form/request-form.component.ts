import { Component, OnInit } from '@angular/core';
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
import { MatDialogRef } from '@angular/material/dialog';
import { RepportRequestService } from 'src/app/services/request/repport-request.service';
import { ReportRequest } from 'src/app/models/report-request';

const format = 'yyyy-MM-dd';
const locale = 'en-US';

@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.css']
})
export class RequestFormComponent implements OnInit {

  requestForm: FormGroup;
  projetsOptions: ProjectItem[];
  activityOptions: ActivityItem[];
  usersOptions: User[];
  matcher = new MyErrorStateMatcher();

  params = new ReportRequest();

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
    private userService: UserService) { }

  ngOnInit(): void {
    this.initForm();

    this.projectService.getApparentableProject(-1).subscribe(projets =>{
      this.projetsOptions = this.projectService.generateParentOption(projets, 0);
    });

    this.activityService.getAllActivity().subscribe(activitys =>{
      this.activityOptions = activitys;
    });

    this.userService.getAllUser().subscribe(users =>{
      this.usersOptions = users;
      for(let user of this.usersOptions) {
        user.display_string = user.first_name + " " + user.last_name;
      }
    });
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

  
 
  onSubmit() {
    let dateDeb = this.requestForm.controls['dateDebut'].value;
    if(dateDeb) this.params.dateDebut = formatDate(dateDeb, format, locale);

    let dateFin = this.requestForm.controls['dateFin'].value;
    if(dateFin) this.params.dateFin = formatDate(dateFin, format, locale);

    if(this.requestForm.controls['projects'].value)
      for(let project of this.requestForm.controls['projects'].value)
      this.params.projects.push(project.id);

    if(this.requestForm.controls['activitys'].value)
      for(let activity of this.requestForm.controls['activitys'].value)
      this.params.activitys.push(activity.id);

    if(this.requestForm.controls['users'].value)
      for(let user of this.requestForm.controls['users'].value)
      this.params.users.push(user.id);

    let navigationExtras: NavigationExtras = { state: { params: this.params } };
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
