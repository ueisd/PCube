import { Component, OnInit, Output, EventEmitter, Inject, Optional } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service'; 
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef , MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/components/domain/user/User';
import { RoleService } from 'src/app/services/role.service'
import { Role } from 'src/app/Model/role';

@Component({
  selector: 'app-modify-user',
  templateUrl: './modify-user.component.html',
  styleUrls: ['./modify-user.component.css']
})
export class ModifyUserComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ModifyUserComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: User,
    private userService: UserService,
    private roleService: RoleService) { }

  modifyUserForm: FormGroup;
  hasToRefresh: boolean = true;
  isUnique: boolean;
  isAdded: boolean;
  roles: Role[];

  @Output() refreshDataEvent = new EventEmitter<boolean>();

  askForDataRefresh() {
    this.refreshDataEvent.emit(this.hasToRefresh);
  }

  ngOnInit(): void {
    this.roleService.getRoless().subscribe(res=>{
      this.roles= res;
    });
    this.initForm();
    this.isAdded = false;
    this.isUnique = true;
  }

  private onSubmitSuccess(){
    this.isAdded = true;
    this.askForDataRefresh();
    this.modifyUserForm.reset();
    this.dialogRef.close(true);
  }

  onSubmit() {
    if(this.modifyUserForm.valid){
      const id = this.modifyUserForm.controls['id'].value;
      const email = this.modifyUserForm.controls['email'].value;
      const firstName = this.modifyUserForm.controls['firstName'].value;
      const lastName = this.modifyUserForm.controls['lastName'].value;
      const newEmail = this.modifyUserForm.controls['newEmail'].value;
      const roleId = this.modifyUserForm.controls['roleId'].value;

      this.userService.modifyUser(id, email, firstName, lastName, newEmail, roleId).subscribe(user => {
          if(user.id != -1){
            this.onSubmitSuccess();
          }else{
            this.isAdded = false;
          }
      });
    }
  }

  checkUniqueEmail(newValue){
    if(newValue != null && newValue.trim().length != 0){
      this.isUnique = true;
      this.userService.isEmailUnique(newValue).subscribe(isUnique => this.isUnique = isUnique);
    }
  }

  private initForm() {
    this.modifyUserForm = new FormGroup({
      'id': new FormControl(),
      'email': new FormControl(),
      'firstName': new FormControl('', [Validators.required]),
      'lastName': new FormControl('', [Validators.required]),
      'newEmail': new FormControl('', [Validators.required]),
      'roleId': new FormControl('', [Validators.required])
    });
  }
}
