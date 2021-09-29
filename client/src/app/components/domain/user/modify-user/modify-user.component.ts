import { Component, OnInit, Output, EventEmitter, Inject, Optional } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service'; 
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef , MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/models/user';
import { RoleService } from 'src/app/services/role/role.service'
import { Role } from 'src/app/models/role';

@Component({
  selector: 'app-modify-user',
  templateUrl: './modify-user.component.html',
  styleUrls: ['./modify-user.component.css']
})
export class ModifyUserComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ModifyUserComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private roleService: RoleService) { }

  modifyUserForm: FormGroup;
  hasToRefresh: boolean = true;
  isUnique: boolean;
  isAdded: boolean;
  roles: Role[];
  isCurrentUser: boolean = false;

  canceledMessage="Canceled"

  @Output() refreshDataEvent = new EventEmitter<boolean>();

  askForDataRefresh() {
    this.refreshDataEvent.emit(this.hasToRefresh);
  }

  async ngOnInit(): Promise<void> {
    this.isAdded = false;
    this.isUnique = true;
    this.initForm();
    this.roles = await this.roleService.getRoles().toPromise();
    this.setDefaultValues();
  }

  setDefaultValues() {
    this.modifyUserForm.controls['id'].setValue(this.data.id);
    this.modifyUserForm.controls['email'].setValue(this.data.email);
    this.modifyUserForm.controls['firstName'].setValue(this.data.firstName);
    this.modifyUserForm.controls['lastName'].setValue(this.data.lastName);
    this.modifyUserForm.controls['newEmail'].setValue(this.data.email);
    this.modifyUserForm.controls['roles'].setValue(new Role(this.data.roleId, this.data.roleName, this.data.roleId));
    if(localStorage.getItem('email') === this.data.email)
      this.isCurrentUser = true;
  }

  private onSubmitSuccess(){
    this.isAdded = true;
    this.askForDataRefresh();
    this.modifyUserForm.reset();
    this.dialogRef.close(true);
  }

  async onSubmit() {
    if(this.modifyUserForm.valid){
      const id = this.modifyUserForm.controls['id'].value;
      const firstName = this.modifyUserForm.controls['firstName'].value;
      const lastName = this.modifyUserForm.controls['lastName'].value;
      const email = this.modifyUserForm.controls['newEmail'].value;
      const roleId : number = this.modifyUserForm.get("roles").value["id"];
      
      let user = await this.userService.modifyUser(
        id, email, firstName, lastName, roleId
      ).toPromise()
      if(user.id != -1) 
        this.onSubmitSuccess();
      else 
        this.isAdded = false;
    }
  }

  async checkUniqueEmail(newValue){
    if(newValue != null && newValue.toUpperCase() === this.data.email.toUpperCase()) {
      this.isUnique = true;
      return;
    }

    if(newValue != null && newValue.trim().length != 0){
      this.isUnique = true;
      this.isUnique = await this.userService.isEmailUnique(newValue).toPromise();
    }
  }

  private initForm() {
    this.modifyUserForm = new FormGroup({
      'id': new FormControl(),
      'email': new FormControl(),
      'firstName': new FormControl('', [Validators.required]),
      'lastName': new FormControl('', [Validators.required]),
      'newEmail': new FormControl('', [Validators.required]),
      'roles': new FormControl('', [Validators.required])
    });
  }
}
