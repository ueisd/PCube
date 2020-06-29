import { Component, OnInit, Output, EventEmitter, Inject, Optional } from '@angular/core';
import { ActivityService } from 'src/app/services/activity/activity.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";


@Component({
  selector: 'app-add-activity',
  templateUrl: './add-activity.component.html',
  styleUrls: ['./add-activity.component.css'],
})

export class AddActivityComponent implements OnInit{

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private activityService: ActivityService, private dialogRef: MatDialogRef<AddActivityComponent>) { }

  newActivityForm: FormGroup;

  ngOnInit(): void {
    this.initForm();
    this.isAdded = false;
    this.isUnique = true;
  }

  isAdded: boolean;


  private onSubmitSuccess(){
    this.isAdded = true;
    this.newActivityForm.reset();
    this.dialogRef.close(true);
  }

  onSubmit(){

    if(this.newActivityForm.valid){
      this.activityService.addNewActivity(this.newActivityForm.controls['activityName'].value).subscribe(activity => {
          if(activity.id != -1){
            this.onSubmitSuccess();
          }else{
            this.isAdded = false;
          }
      });
    }
  }

  isUnique: boolean;

  checkUniqueName(newValue){
    if(newValue != null && newValue.trim().length != 0){
      this.activityService.isNameUnique(newValue).subscribe(isUnique => this.isUnique = isUnique);
    }
  }

  private initForm(){
    
    this.newActivityForm = new FormGroup({
      'activityName': new FormControl('', [Validators.required])
    });
  }
  

}
