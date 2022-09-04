import { Component, OnInit, Inject, Optional } from '@angular/core';
import { ActivityService } from 'src/app/services/activity/activity.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivityItem } from 'src/app/models/activity';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackBar } from 'src/app/utils/custom-snackbar';
import { FormValidatorBuilder } from '../../../utils/FormValidatorBuilder';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-add-activity',
  templateUrl: './add-activity.component.html',
  styleUrls: ['./add-activity.component.css'],
})
export class AddActivityComponent implements OnInit {
  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any, private activityService: ActivityService, private dialogRef: MatDialogRef<AddActivityComponent>, private snackBar: MatSnackBar) {}

  ActivityForm: FormGroup;
  isCreateForm = true;

  activityItem: ActivityItem;

  customSnackBar: CustomSnackBar = new CustomSnackBar(this.snackBar);

  errorMessage = null;

  validationMessages = {};
  canceledMessage = 'Canceled';

  ngOnInit(): void {
    this.initForm();

    this.isCreateForm = !this.data;

    if (!this.isCreateForm) {
      this.activityItem = this.data.activity;
      this.ActivityForm.get('activityName').setValue(this.activityItem.name);
    }
  }

  private onSubmitSuccess() {
    this.dialogRef.close(true);
  }

  async tryCreateActivity() {
    const name = this.ActivityForm.controls.activityName.value;

    try {
      await this.activityService.addNewActivity(name).toPromise();
      this.onSubmitSuccess();
    } catch (err) {
      this.errorMessage = `${err.error.name} : ${err.error.message}`;
    }
  }

  async tryUpdateActivity(newName: string) {
    try {
      await this.activityService.updateActivity(this.activityItem.id, newName).toPromise();
      this.onSubmitSuccess();
    } catch (err) {
      this.errorMessage = `${err.error.name} : ${err.error.message}`;
    }
  }

  onSubmit() {
    if (!this.ActivityForm.valid) {
      return;
    }

    if (this.isCreateForm) {
      this.tryCreateActivity();
    } else {
      this.tryUpdateActivity(this.ActivityForm.get('activityName').value);
    }
  }

  private initForm() {
    const { activityNameValidators, nameUniqueAsyncValidator } = this.initValidators();
    this.ActivityForm = new FormGroup({
      activityName: new FormControl('', Validators.compose(activityNameValidators), [nameUniqueAsyncValidator]),
    });
  }

  public isFieldError(fieldName, validation, lazy?: boolean) {
    const isFieldError = this.ActivityForm.get(fieldName).hasError(validation.type);
    if (lazy) {
      return isFieldError;
    }

    return isFieldError && (this.ActivityForm.get(fieldName).dirty || this.ActivityForm.get(fieldName).touched);
  }

  private initValidators() {
    const validatorBuilder = new FormValidatorBuilder(this.validationMessages);

    const activityNameValidators = validatorBuilder.buildStringValidators({ field: 'activityName', label: 'nom', min: 5, max: 40, required: true });

    const nameUniqueAsyncValidator = validatorBuilder.generateCustomAsyncValidator({
      field: 'activityName',
      validatorFn: (val) => this.activityService.isNameExist(val).pipe(map((isNameExist) => isNameExist)),
      error: { type: 'nameAlreadyExist', message: `Le nom n'est pas unique` },
    });

    return { activityNameValidators, nameUniqueAsyncValidator };
  }
}
