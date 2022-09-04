import { Component, OnInit, Inject, Optional } from '@angular/core';
import { ActivityService } from 'src/app/services/activity/activity.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivityItem } from 'src/app/models/activity';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackBar } from 'src/app/utils/custom-snackbar';

@Component({
  selector: 'app-add-activity',
  templateUrl: './add-activity.component.html',
  styleUrls: ['./add-activity.component.css'],
})
export class AddActivityComponent implements OnInit {
  canceledMessage = 'Canceled';

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any, private activityService: ActivityService, private dialogRef: MatDialogRef<AddActivityComponent>, private snackBar: MatSnackBar) {}

  newActivityForm: FormGroup;
  activityItem: ActivityItem;

  customSnackBar: CustomSnackBar = new CustomSnackBar(this.snackBar);
  isUnique: boolean;

  isAdded: boolean;
  isCreateForm = true;

  ngOnInit(): void {
    this.initForm();

    if (this.data) {
      this.activityItem = this.data.activity;
      this.isCreateForm = false;
      this.newActivityForm.get('activityName').setValue(this.activityItem.name);
    } else {
      this.isCreateForm = true;
    }

    this.isAdded = false;
    this.isUnique = true;
  }

  private onSubmitSuccess() {
    this.dialogRef.close(true);
  }

  async createNewActivity() {
    const name = this.newActivityForm.controls.activityName.value;
    const activity = await this.activityService.addNewActivity(name).toPromise();
    if (activity.id !== -1) {
      this.onSubmitSuccess();
    } else {
      this.isAdded = false;
    }
  }

  async updateAnActivity(newName: string) {
    try {
      await this.activityService.updateActivity(this.activityItem.id, newName).toPromise();
      this.dialogRef.close(true);
    } catch (error) {
      this.customSnackBar.openSnackBar(`Une erreur s'est produite, veuillez`, 'notif-error');
      this.isAdded = false;
    }
  }

  onSubmit() {
    if (!this.newActivityForm.valid) {
      return;
    }

    if (this.isCreateForm) {
      this.createNewActivity();
    } else {
      this.updateAnActivity(this.newActivityForm.get('activityName').value);
    }
  }

  async checkUniqueName(newName) {
    if (!this.isCreateForm && newName === this.activityItem.name) {
      this.isUnique = true;
      return;
    } else if (newName != null && newName.trim().length !== 0) {
      this.isUnique = !(await this.activityService.isNameExist(newName).toPromise());
    }
  }

  private initForm() {
    this.newActivityForm = new FormGroup({
      activityName: new FormControl('', [Validators.required]),
    });
  }
}
