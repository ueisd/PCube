import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivityService } from 'src/app/services/activity/activity.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-activity',
  templateUrl: './add-activity.component.html',
  styleUrls: ['./add-activity.component.css'],
})

export class AddActivityComponent implements OnInit{

  constructor(private activityService: ActivityService) { }

  newActivityForm: FormGroup;

  hasToRefresh: boolean = true;

  @Output() refreshDataEvent = new EventEmitter<boolean>();

  askForDataRefresh() {
    this.refreshDataEvent.emit(this.hasToRefresh);
  }

  ngOnInit(): void {
    this.initForm();
    this.isAdded = false;
    this.isUnique = true;
  }

  isAdded: boolean;


  private onSubmitSuccess(){
    this.isAdded = true;
    this.askForDataRefresh();
    this.newActivityForm.reset();
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
