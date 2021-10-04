import { Component, OnInit, AfterContentInit, Optional, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ProjectService } from 'src/app/services/project/project.service';
import { ProjectItem } from 'src/app/models/project';
import { ActivityService } from 'src/app/services/activity/activity.service';
import { ActivityItem } from 'src/app/models/activity';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/models/user';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RepportRequestService } from 'src/app/services/request/repport-request.service';
import { ReportRequest } from 'src/app/models/report-request';
import { DateManip } from 'src/app/utils/date-manip';
import { CurentUserService } from 'src/app/shared/services/curent-user.service';

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
  title = '';
  matcher = new MyErrorStateMatcher();

  params = new ReportRequest();

  isMember : boolean;
  member : User;


  isProjets(checked: boolean) {
    if(!checked)
      this.requestForm.get('projects').reset();
  }

  isActivitys(checked: boolean) {
    if(!checked)
      this.requestForm.get('activitys').reset();
  }

  isUsers(checked: boolean) {
    if(!checked)
      this.requestForm.get('users').reset();
  }

  constructor(private fb: FormBuilder, private projectService: ProjectService,
    private activityService: ActivityService, private router: Router,
    private dialogRef: MatDialogRef<RequestFormComponent>,
    private reportReqService: RepportRequestService,
    private userService: UserService,
    private curentUserService: CurentUserService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
      let curentUser = curentUserService.curentUser.value.user;
      if(curentUser && curentUser.role.accessLevel == 3)
        this.isMember = true;
      if(data.type == "temps")
        this.title = 'Gérer les lignes de temps';
      if(data.type == "rapport")
        this.title = 'Génération d\'un rapport';
    }

  async ngOnInit(): Promise<void> {
    this.initForm();
    
    this.params = this.reportReqService.paramForForm;

    let projets = await this.projectService.getApparentableProject(-1).toPromise();
    this.projetsOptions = this.projectService.generateParentOption(projets, 0);
      this.requestForm.controls['projects'].setValue(this.params.projects);
    if(this.params.projects.length && this.params.projects.length > 0)
      this.requestForm.controls['isProjets'].setValue(true);
    
    let activitys = await this.activityService.getAllActivity().toPromise();
    this.activityOptions = activitys;
      this.requestForm.controls['activitys'].setValue(this.params.activitys);
    if(this.params.activitys.length && this.params.activitys.length > 0)
      this.requestForm.controls['isActivitys'].setValue(true);
    


    if(!this.isMember) {
      this.usersOptions = await this.userService.getAllUser().toPromise();
      for(let user of this.usersOptions) {
        user.display_string = user.getFullName();
      }
      this.requestForm.controls['users'].setValue(this.params.users);
      if(this.params.users.length && this.params.users.length > 0)
        this.requestForm.controls['isUsers'].setValue(true);
    } else {
      let usr = this.curentUserService.curentUser.value.user;
      this.member = new User();
      this.member.firstName = usr.firstName;
      this.member.lastName = usr.lastName;
      this.member.email = usr.email;
      this.member.id = usr.id;
      this.member.display_string = this.member.getFullName();
      this.requestForm.controls['users'].setValue(this.member.display_string);
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
      {validators: this.ensureIsInterval}
    );
  }

  ensureIsInterval: ValidatorFn = (fg: FormGroup) => {
    const start = fg.get('dateDebut').value;
    const end = fg.get('dateFin').value;
    
    if(start && end && !DateManip.isDatesAreIntevals(start, end))
        return { dateFinAvantDebut: true };
    return null;
  };

  setMemberParameters() {
    this.requestForm.controls['users'].disable();
    this.requestForm.controls['isUsers'].setValue(true);
  }
 
  onSubmit() {
    let dateDeb = this.requestForm.controls['dateDebut'].value;
    if(dateDeb) this.params.dateDebut = DateManip.formatDate(dateDeb);
    else this.params.dateDebut = "";

    let dateFin = this.requestForm.controls['dateFin'].value;
    if(dateFin) this.params.dateFin = DateManip.formatDate(dateFin);
    else this.params.dateFin = "";

    if(this.requestForm.controls['projects'].value) 
      this.params.projects = this.requestForm.controls['projects'].value;
    else
      this.params.projects = [];

    if(this.requestForm.controls['activitys'].value)
      this.params.activitys = this.requestForm.controls['activitys'].value;
    else
      this.params.activitys = [];

    if(!this.isMember) {
      if(this.requestForm.controls['users'].value)
        this.params.users = this.requestForm.controls['users'].value;
      else
        this.params.users = [];
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
