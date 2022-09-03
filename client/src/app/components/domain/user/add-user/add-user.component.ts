import { Component, OnInit, Output, EventEmitter, Input, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { RoleService } from 'src/app/services/role/role.service';
import { Role } from 'src/app/models/role';
import { User } from '../../../../models/user';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackBar } from 'src/app/utils/custom-snackbar';
import { FormValidatorBuilder } from '../../../utils/FormValidatorBuilder';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent implements OnInit {
  accessLevel: number;
  roles: Role[];
  userForm: FormGroup;
  hasToRefresh = true;

  @Input() isChecked = false;
  @Output() createUser: EventEmitter<any> = new EventEmitter();
  @Output() refreshDataEvent = new EventEmitter<boolean>();

  customSnackBar: CustomSnackBar = new CustomSnackBar(this.snackBar);

  errorMessage;
  canceledMessage = 'Canceled';

  validationMessages = {};

  constructor(private userService: UserService, private roleService: RoleService, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<AddUserComponent>, private snackBar: MatSnackBar) {}

  async ngOnInit(): Promise<void> {
    this.initForm();
    this.roles = await this.roleService.getRoles().toPromise();
  }

  askForDataRefresh() {
    this.refreshDataEvent.emit(this.hasToRefresh);
  }

  private onSubmitSuccess(user: User) {
    this.askForDataRefresh();
    // this.userForm.reset();
    this.dialogRef.close(user);
  }

  async onSubmit() {
    const user = new User();
    user.firstName = this.userForm.get('name').value;
    user.lastName = this.userForm.get('lname').value;
    user.email = this.userForm.get('email').value;
    user.role.id = this.userForm.get('roles').value.id;
    user.role.name = this.userForm.get('roles').value.name;
    const password = this.userForm.get('password').value;

    try {
      const result = await this.userService.createUser(user, password).toPromise();
      // TODO corriger le backend pour qu'il envoie le role dans sa réponse (PLM)
      result.role = user.role;
      this.onSubmitSuccess(new User(result));
    } catch (err) {
      this.errorMessage = `${err.error.name} : ${err.error.message}`;
    }
  }

  public isFieldError(fieldName, validation, lazy?: boolean) {
    const isFieldError = this.userForm.get(fieldName).hasError(validation.type);
    if (lazy) {
      return isFieldError;
    }

    return isFieldError && (this.userForm.get(fieldName).dirty || this.userForm.get(fieldName).touched);
  }

  private initForm() {
    const { passwordMatchValidator, ValidateEmailUnique, emailValidators, nameValidators, lastNameValidators, passwordValidators, passwordConfirmValidators, requireRoleValidators } = this.initValidators();

    this.userForm = this.fb.group(
      {
        name: ['', Validators.compose(nameValidators)],
        lname: ['', Validators.compose(lastNameValidators)],
        email: ['', Validators.compose(emailValidators), [ValidateEmailUnique]],
        password: ['', Validators.compose(passwordValidators)],
        passwordConfirmation: ['', Validators.compose(passwordConfirmValidators)],
        roles: ['', requireRoleValidators],
      },
      { validators: passwordMatchValidator }
    );
  }

  private initValidators() {
    const validatorBuilder = new FormValidatorBuilder(this.validationMessages);

    const passwordMatchValidator = validatorBuilder.buildCustomSyncValidator({
      field: 'passwordConfirmation',
      isErrorFn: (control: AbstractControl) => control.get('password').value !== control.get('passwordConfirmation').value,
      error: { type: 'notMatching', message: 'Les mots de passe ne matchent pas' },
    });

    const ValidateEmailUnique = validatorBuilder.generateCustomAsyncValidator({ field: 'email', validatorFn: (val) => this.userService.isEmailExist(val), error: { type: 'emailAlreadyExist', message: 'Le email n est pas unique' } });

    const emailValidators = [
      ...validatorBuilder.buildStringValidators({ field: 'email', label: 'email', min: 5, max: 100, required: true }),
      ...validatorBuilder.buildComposedSyncValidators({ field: 'email', validators: [{ validator: Validators.email, error: { type: 'email', message: 'Le champ doit être un email' } }] }),
    ];

    const nameValidators = validatorBuilder.buildStringValidators({ field: 'name', label: 'nom', min: 5, max: 40, required: true });

    const lastNameValidators = validatorBuilder.buildStringValidators({ field: 'lname', label: 'Nom de famille', min: 5, max: 40, required: true });

    const passwordValidators = validatorBuilder.buildStringValidators({ field: 'password', label: 'password', min: 5, max: 20, required: true });

    const passwordConfirmValidators = validatorBuilder.buildStringValidators({ field: 'passwordConfirmation', label: 'passwordConfirm', min: 5, max: 20, required: true });

    const requireRoleValidators = validatorBuilder.buildComposedSyncValidators({ field: 'roles', validators: [{ validator: Validators.required, error: { type: 'required', message: 'Un rôle est requis' } }] });

    return { passwordMatchValidator, ValidateEmailUnique, emailValidators, nameValidators, lastNameValidators, passwordValidators, passwordConfirmValidators, requireRoleValidators };
  }
}
