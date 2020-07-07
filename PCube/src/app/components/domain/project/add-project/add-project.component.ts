import { Component, OnInit, Output, EventEmitter, Inject, Optional } from '@angular/core';
import { ProjectService } from 'src/app/services/project/project.service';
import { FormControl, FormGroup, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import * as $ from 'jquery/dist/jquery.min.js';
import { ProjectItem } from '../../../../models/project';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

const PARENT_NAME_INPUT_ID = "parentName";
const PROJECT_NAME_INPUT_ID = "projectName";
const TABLE_AUTOCOMPLETE_ID = "autocomplete-table";

@Component({
  selector: 'app-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {

  @Output() refreshDataEvent = new EventEmitter<boolean>();

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  private projectService: ProjectService, private dialogRef: MatDialogRef<AddProjectComponent>) { }

  newProjectForm: FormGroup;

  hasToRefresh: boolean = true;

  askForDataRefresh() {
    this.refreshDataEvent.emit(this.hasToRefresh);
  }

  ngOnInit(): void {
    this.initForm();
    this.isAdded = false;
    this.isUnique = true;
    this.isAddedFailled = false;
  }

  isAdded: boolean;
  isAddedFailled: boolean;

  private onSubmitSuccess(){
    this.isAdded = true;
    this.askForDataRefresh();
    this.isAddedFailled = false;
    this.newProjectForm.reset();
    this.dialogRef.close(true);
  }

  private onSubmitFailled(){
    this.isAdded = false;
    this.isAddedFailled = true;
  }

  onSubmit(){

    if(this.newProjectForm.valid){

      let name: string = this.newProjectForm.controls['projectName'].value;
      let isChild: boolean = this.newProjectForm.controls['isChild'].value;
      let parentName:string = (isChild) ? this.newProjectForm.controls['parentName'].value: name;

      this.projectService.addNewProject(name, parentName).subscribe(project => {
          if(project.id != -1){
            this.onSubmitSuccess();
          }else{
            this.onSubmitFailled();
          }
      });
    }
  }

  isUnique: boolean;

  projectNameOnChange(newValue){
    if(newValue != null && newValue.trim().length != 0){
      this.projectService.isNameUnique(newValue).subscribe(isUnique => this.isUnique = isUnique);
    }
  }

  autocomplete: ProjectItem[]

  parentNameOnChange(parentName){

    if(parentName == null || parentName.trim().length == 0){
      this.autocomplete = [];
      return;
    }
    
    this.projectService.getProjectNameForAutocomplete(parentName).subscribe(projects => {

      this.autocomplete = [];

      if(projects.length == 1 && parentName.toUpperCase() == projects[0].name.toUpperCase())
        return;

      $("#"+TABLE_AUTOCOMPLETE_ID).empty();
      projects.forEach(project => {
        this.autocomplete.push(project);
      });

    });

  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  async parentNameFocusOut(){
    await this.delay(200);
    this.autocomplete = [];
  }

  autocompleteChoice(event, item){
    console.log(item.name);
    this.newProjectForm.get('parentName').setValue(item.name);
    this.autocomplete = [];
    this.checkParentExist(item.name);
  }

  isParentExist: boolean

  checkParentExist(parentName){
    if(parentName != null && parentName.trim().length != 0){
      this.projectService.isNameUnique(parentName).subscribe(isUnique => {
        this.isParentExist = !isUnique;
      });
    }
  }

  private addOrRemoveHiddenClass(id, isHidden){
    if(isHidden)
      $("#"+id).addClass("hidden");
    else
      $("#"+id).removeClass("hidden");
  }

  isChild: boolean = false;

  isChildChecked(checked: boolean){

    if(!checked)
      this.newProjectForm.get('parentName').reset();

    this.isChild = checked
    this.addOrRemoveHiddenClass("parentName-div", !checked);
  }

  isFormValid: boolean = false;

  validateForm: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const projectName = control.get('projectName').value;
    const isChild = control.get('isChild').value;
    const parentName = control.get('parentName').value;

    if(projectName == null || projectName.trim().length == 0){
      this.isFormValid = false;
      return null;
    }
      

    if(isChild && (parentName == null || parentName.trim().length == 0)){
      this.isFormValid = false;
      return null;
    }
    
    if(this.isChild){
      this.checkParentExist(parentName);
    }else{
      this.isParentExist = true;
    }

    this.isFormValid = true;
    return null;
  }

  private initForm(){
    
    this.newProjectForm = new FormGroup({
      'projectName': new FormControl(),
      'isChild': new FormControl(),
      'parentName': new FormControl()
    }, {validators: this.validateForm});
  }
}