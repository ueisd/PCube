import { Component, OnInit, Output, EventEmitter, Inject, Optional } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoleService } from 'src/app/services/role/role.service';
import { Role } from 'src/app/models/role';
import { FormValidatorBuilder } from '../../../utils/FormValidatorBuilder';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-modify-user',
  templateUrl: './modify-user.component.html',
  styleUrls: ['./modify-user.component.css'],
})
export class ModifyUserComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<ModifyUserComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data: any, private userService: UserService, private roleService: RoleService) {}

  modifyUserForm: FormGroup;
  hasToRefresh = true;
  roles: Role[];
  isCurrentUser = false;
  errorMessage: string;

  canceledMessage = 'Canceled';
  validationMessages = {};

  @Output() refreshDataEvent = new EventEmitter<boolean>();

  askForDataRefresh() {
    this.refreshDataEvent.emit(this.hasToRefresh);
  }

  async ngOnInit(): Promise<void> {
    this.initForm();
    this.isCurrentUser = this.isEmailOfCurrentUser(this.data.email);
    this.roles = await this.roleService.getRoles().toPromise();
    this.setDefaultValues();
  }

  setDefaultValues() {
    const form = this.modifyUserForm.controls;
    form.id.setValue(this.data.id);
    form.email.setValue(this.data.email);
    form.firstName.setValue(this.data.firstName);
    form.lastName.setValue(this.data.lastName);
    form.newEmail.setValue(this.data.email);
    form.roles.setValue(new Role(this.data.roleId, this.data.roleName, this.data.roleId));
  }

  private isEmailOfCurrentUser(email) {
    return localStorage.getItem('email') === email;
  }

  private onSubmitSuccess(editedUser) {
    this.askForDataRefresh();
    // this.modifyUserForm.reset();
    this.dialogRef.close(editedUser);
  }

  async onSubmit() {
    this.errorMessage = null;

    if (!this.modifyUserForm.valid) {
      return;
    }

    const params = this.fetchModifyUserParamsFromForm();

    const user = await this.tryUpdateUser(params);

    if (isUser(user)) {
      this.onSubmitSuccess(user);
    }
  }

  private async tryUpdateUser({ id, email, firstName, lastName, roleId }) {
    try {
      return await this.userService.modifyUser(id, email, firstName, lastName, roleId).toPromise();
    } catch (err) {
      this.errorMessage = `${err.error.name} : ${err.error.message}`;
      return null;
    }
  }

  private fetchModifyUserParamsFromForm() {
    return {
      id: this.modifyUserForm.controls.id.value,
      firstName: this.modifyUserForm.controls.firstName.value,
      lastName: this.modifyUserForm.controls.lastName.value,
      email: this.modifyUserForm.controls.newEmail.value,
      roleId: this.modifyUserForm.get('roles').value.id,
    };
  }

  public isFieldError(fieldName, validation, lazy?: boolean) {
    const isFieldError = this.modifyUserForm.get(fieldName).hasError(validation.type);
    if (lazy) {
      return isFieldError;
    }

    return isFieldError && (this.modifyUserForm.get(fieldName).dirty || this.modifyUserForm.get(fieldName).touched);
  }

  private initForm() {
    const { ValidateEmailUnique, emailValidators, nameValidators, lastNameValidators, requireRoleValidators } = this.initValidators();
    this.modifyUserForm = new FormGroup({
      id: new FormControl(),
      email: new FormControl(),
      firstName: new FormControl('', Validators.compose(nameValidators)),
      lastName: new FormControl('', Validators.compose(lastNameValidators)),
      newEmail: new FormControl('', Validators.compose(emailValidators), [ValidateEmailUnique]),
      roles: new FormControl('', requireRoleValidators),
    });
  }

  private initValidators() {
    const validatorBuilder = new FormValidatorBuilder(this.validationMessages);

    const ValidateEmailUnique = validatorBuilder.generateCustomAsyncValidator({
      field: 'newEmail',
      validatorFn: (val) => this.userService.isEmailExist(val).pipe(map((isExist) => isExist && val !== this.data.email)),
      error: { type: 'emailAlreadyExist', message: 'Le email n est pas unique' },
    });

    const emailValidators = [
      ...validatorBuilder.buildStringValidators({ field: 'newEmail', label: 'email', min: 5, max: 100, required: true }),
      ...validatorBuilder.buildComposedSyncValidators({ field: 'newEmail', validators: [{ validator: Validators.email, error: { type: 'email', message: 'Le champ doit être un email' } }] }),
    ];

    const nameValidators = validatorBuilder.buildStringValidators({ field: 'firstName', label: 'nom', min: 5, max: 40, required: true });

    const lastNameValidators = validatorBuilder.buildStringValidators({ field: 'lastName', label: 'Nom de famille', min: 5, max: 40, required: true });

    const requireRoleValidators = validatorBuilder.buildComposedSyncValidators({ field: 'roles', validators: [{ validator: Validators.required, error: { type: 'required', message: 'Un rôle est requis' } }] });

    return { ValidateEmailUnique, emailValidators, nameValidators, lastNameValidators, requireRoleValidators };
  }
}

function isUser(user) {
  return user && user.id !== -1;
}
