import { Component, OnInit, Output, EventEmitter, Inject, Optional } from '@angular/core';
import { ActivityService } from 'src/app/services/activity/activity.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ActivityItem } from 'src/app/models/activity';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackBar } from 'src/app/utils/custom-snackbar';


@Component({
  selector: 'app-add-activity',
  templateUrl: './add-activity.component.html',
  styleUrls: ['./add-activity.component.css'],
})

export class AddActivityComponent implements OnInit{

  canceledMessage = "Canceled";

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private activityService: ActivityService, 
    private dialogRef: MatDialogRef<AddActivityComponent>,
    private snackBar: MatSnackBar,
    ) { }

  newActivityForm: FormGroup;
  activityItem:ActivityItem;

  isUnmodifiedValue:boolean = false;
  customSnackBar:CustomSnackBar = new CustomSnackBar(this.snackBar)

  ngOnInit(): void {
  
    this.initForm();

    if(this.data){
      this.activityItem = this.data.activity;
      this.isCreateForm = false;
      this.isUnmodifiedValue = true;
      this.newActivityForm.get("activityName").setValue(this.activityItem.name);
    }
    else
      this.isCreateForm = true;


    this.isAdded = false;
    this.isUnique = true;
  }

  isAdded: boolean;
  isCreateForm:boolean = true;

  private onSubmitSuccess(){
    this.dialogRef.close(true);
  }

  async createNewActivity(){
    let activity = await this.activityService.addNewActivity(
      this.newActivityForm.controls['activityName'].value
    ).toPromise();
    if(activity.id != -1){
      this.onSubmitSuccess();
    }else{
      this.isAdded = false;
    }
  }

  async updateAnActivity(newName:string){
    try {
      await this.activityService.updateActivity(
        this.activityItem.id, this.activityItem.name, newName
      ).toPromise();
      this.dialogRef.close(true);
    } catch(error) {
      this.customSnackBar.openSnackBar("Une erreur s'est produit, veuillez", 'notif-error');
      this.isAdded = false;
    }
  }

  onSubmit(){

    if(!this.newActivityForm.valid)
      return;

    if(this.isCreateForm)
      this.createNewActivity();
    else
      this.updateAnActivity(this.newActivityForm.get("activityName").value);

  }

  isUnique: boolean;

  async checkUniqueName(newValue){

    if(!this.isCreateForm && newValue == this.activityItem.name){
      this.isUnique = true;
      this.isUnmodifiedValue = true;
      return;
    }

    if(newValue != null && newValue.trim().length != 0){
      this.isUnique = await this.activityService.isNameUnique(newValue).toPromise();
      this.isUnmodifiedValue = false;
    }
  }

  private initForm(){
    
    this.newActivityForm = new FormGroup({
      'activityName': new FormControl('', [Validators.required])
    });
  }
  

}
