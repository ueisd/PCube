import { Component, OnInit, Output, EventEmitter, Input, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { RoleService } from 'src/app/services/role/role.service';
import { Role } from 'src/app/models/role';
import { User } from '../../../../models/user';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackBar } from 'src/app/utils/custom-snackbar';

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
  isUnique: boolean;

  @Input() isChecked = false;
  @Output() createUser: EventEmitter<any> = new EventEmitter();
  @Output() refreshDataEvent = new EventEmitter<boolean>();

  customSnackBar: CustomSnackBar = new CustomSnackBar(this.snackBar);

  errorMessage;
  canceledMessage = 'Canceled';

  constructor(private userService: UserService, private roleService: RoleService, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<AddUserComponent>, private snackBar: MatSnackBar) {}

  async ngOnInit(): Promise<void> {
    this.isAdded = false;
    this.isUnique = true;
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

  private initForm() {
    this.userForm = this.fb.group(
      {
        name: ['', Validators.required],
        lname: ['', Validators.required],
        email: ['', Validators.required],
        password: ['', Validators.required],
        passwordConfirmation: ['', Validators.required],
        roles: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  async checkUniqueEmail(newValue) {
    if (newValue !== null && newValue.trim().length !== 0) {
      this.isUnique = true;
      this.isUnique = !(await this.userService.isEmailExist(newValue).toPromise());
    }
  }
}
