import { Component, OnInit, Output, EventEmitter, Input, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { RoleService } from 'src/app/services/role/role.service';
import { Role } from 'src/app/models/role';
import { User } from '../../../../models/user';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackBar } from 'src/app/utils/custom-snackbar';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

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
  isAdded: boolean;

  @Input() isChecked = false;
  @Output() createUser: EventEmitter<any> = new EventEmitter();
  @Output() refreshDataEvent = new EventEmitter<boolean>();

  customSnackBar: CustomSnackBar = new CustomSnackBar(this.snackBar);

  errorMessage;
  canceledMessage = 'Canceled';

  validationMessages = {};

  constructor(private userService: UserService, private roleService: RoleService, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<AddUserComponent>, private snackBar: MatSnackBar) {}

  async ngOnInit(): Promise<void> {
    this.isAdded = false;
    this.initForm();
    this.roles = await this.roleService.getRoles().toPromise();
  }

  askForDataRefresh() {
    this.refreshDataEvent.emit(this.hasToRefresh);
  }

  private onSubmitSuccess(user: User) {
    this.isAdded = true;
    this.askForDataRefresh();
    this.userForm.reset();
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
    const passwordConfirmation = this.userForm.get('passwordConfirmation').value;

    if (this.passwordsMatch(password, passwordConfirmation)) {
      try {
        const result = await this.userService.createUser(user, password).toPromise();
        this.onSubmitSuccess(new User(result));
      } catch (err) {
        this.errorMessage = `${err.error.name} : ${err.error.message}`;
      }
    } else {
      this.isAdded = false;
    }
  }

  clicked = () => {
    const email = this.userForm.get('email');
    const password = this.userForm.get('password');
    const passwordConfirmation = this.userForm.get('passwordConfirmation');
    email.disabled ? email.enable() : email.disable();
    password.disabled ? password.enable() : password.disable();
    passwordConfirmation.disabled ? passwordConfirmation.enable() : passwordConfirmation.disable();
    this.isChecked = !this.isChecked;
  };

  passwordsMatch(password: string, confirmation: string) {
    return password === confirmation;
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password').value;
    const confirmPassword = control.get('passwordConfirmation').value;
    if (password === confirmPassword) {
      return null;
    } else {
      control.get('passwordConfirmation').setErrors({ notMatching: true });
    }
  }

  public isFieldError(fieldName, validation, lazy?: boolean) {
    let isFieldError = this.userForm.get(fieldName).hasError(validation.type);
    if (!lazy) {
      isFieldError = isFieldError && (this.userForm.get(fieldName).dirty || this.userForm.get(fieldName).touched);
    }
    return isFieldError;
  }

  private createStringValidator(field: string, props) {
    const stringValidator = new StringValidator(props);

    const validationMessages = stringValidator.getValidationMessages();
    const addedValidators = stringValidator.getValidators();

    _.forEach(props.validators, (val) => {
      addedValidators.push(val.validator);
      validationMessages.push({ type: val.type, message: val.message });
    });

    pushAllByPath(this.validationMessages, field, validationMessages);

    return Validators.compose(addedValidators);
  }

  private initForm() {
    pushAllByPath(this.validationMessages, 'email', [{ type: 'emailAlreadyExist', message: 'Le email n est pas unique' }]);

    const ValidateEmailUnique = (control: AbstractControl): Observable<ValidationErrors> | null => {
      return this.userService.isEmailExist(control.value).pipe(
        map((result: boolean) => {
          if (!result) {
            return null;
          }
          return { emailAlreadyExist: 'Le email n est pas unique' };
        })
      );
    };

    // https://www.thisdot.co/blog/using-custom-async-validators-in-angular-reactive-forms
    const emailValidator = { type: 'email', validator: Validators.email, message: 'Le champ doit être un email' };
    this.userForm = this.fb.group(
      {
        name: ['', this.createStringValidator('name', { fieldLabel: 'nom', min: 5, max: 40, required: true })],
        lname: ['', this.createStringValidator('lname', { fieldLabel: 'Nom de famille', min: 5, max: 40, required: true })],
        email: ['', this.createStringValidator('email', { fieldLabel: 'email', min: 5, max: 100, required: true, validators: [emailValidator] }), [ValidateEmailUnique]],
        password: ['', this.createStringValidator('password', { fieldLabel: 'password', min: 5, max: 20, required: true })],
        passwordConfirmation: ['', this.createStringValidator('passwordConfirmation', { fieldLabel: 'passwordConfirm', min: 5, max: 20, required: true })],
        roles: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
    pushAllByPath(this.validationMessages, 'roles', [{ type: 'required', message: 'Un role est requis' }]);
    pushAllByPath(this.validationMessages, 'passwordConfirmation', [{ type: 'notMatching', message: 'Les mots de passe ne matchent pas' }]);
  }
}

class StringValidator {
  validatorsList = [];
  validatorMessages = [];

  public constructor(params: { fieldLabel: string; required?: boolean; min?: number; max?: number; validators?: { type: string; validator; message: string }[] }) {
    if (params.required) {
      this.validatorsList.push(Validators.required);
      this.validatorMessages.push({ type: 'required', message: `Un ${params.fieldLabel} est requis` });
    }

    if (params.min) {
      this.validatorsList.push(Validators.minLength(params.min));
      this.validatorMessages.push({ type: 'minlength', message: `Minimum ${params.min} caractères` });
    }

    if (params.max) {
      this.validatorsList.push(Validators.maxLength(params.max));
      this.validatorMessages.push({ type: 'maxlength', message: `Maximum ${params.max} caractères` });
    }
  }

  public getValidators() {
    return this.validatorsList;
  }

  public getValidationMessages() {
    return this.validatorMessages;
  }
}

function pushAllByPath(elem, path, values) {
  if (elem[path]) {
    elem[path] = [...elem[path], ...values];
  } else {
    elem[path] = values;
  }
}
