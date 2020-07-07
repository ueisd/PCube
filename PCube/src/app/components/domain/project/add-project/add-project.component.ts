import { Component, OnInit, Output, EventEmitter, Inject, Optional } from '@angular/core';
import { ProjectService } from 'src/app/services/project/project.service';
import { FormControl, FormGroup, Validators, ValidatorFn, ValidationErrors, FormBuilder, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import * as $ from 'jquery/dist/jquery.min.js';
import { ProjectItem } from '../../../../models/project';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { __values } from 'tslib';
import { map } from 'rxjs/internal/operators/map';
import { of } from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs/internal/Observable';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { timer } from 'rxjs/internal/observable/timer';
import { first } from 'rxjs/internal/operators/first';
import { startWith } from 'rxjs/internal/operators/startWith';

@Component({
  selector: 'app-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {

  @Output() refreshDataEvent = new EventEmitter<boolean>();

  newProjectForm: FormGroup;
  hasToRefresh: boolean = true;
  projet: ProjectItem;
  isAddedFailled: boolean = false;
  parentNameOptions: string[];

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  private fb: FormBuilder, private projectService: ProjectService, 
  private dialogRef: MatDialogRef<AddProjectComponent>) { }

  filteredOptions: Observable<string[]>;

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.parentNameOptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  askForDataRefresh() {
    this.refreshDataEvent.emit(this.hasToRefresh);
  }

  ngOnInit(): void {
    this.projet = this.data.projet;
    this.initForm();

    this.projectService.getAllProject().subscribe(projets =>{
      this.parentNameOptions = projets.map((val)=> val.name);
    });

    this.filteredOptions = this.newProjectForm.get('parentName').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private onSubmitSuccess(){
    this.askForDataRefresh();
    this.isAddedFailled = false;
    this.newProjectForm.reset();
    this.dialogRef.close(true);
  }

  private onSubmitFailled(){
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

  isChildChecked(checked: boolean){
    if(!checked) this.newProjectForm.get('parentName').reset();
  }




  validateForm: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    return null;
  }

  nomProjetUniqueValidation(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return timer(500)
        .pipe(
          switchMap(() =>  this.projectService.isNameUnique(control.value)
            .pipe(
              map((isUnique: boolean) => {
                return (isUnique) ? null : { ereureNonUnique: true };
              })
            ).pipe(first())
          )
        )
    };
  }
  
  nomParentExist(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      if(control.value === null || control.value.trim().length == 0) return of(null);
      return timer(500)
        .pipe(
          switchMap(() =>  this.projectService.isNameUnique(control.value)
            .pipe(
              map((isUnique: boolean) => {
                return (isUnique) ? { ereurParentNonExistant: true } : null;
              })
            ).pipe(first())
          )
        );
    };
  }

  validationMessages = {
    'projectName': [
        { type: 'required', message: 'Une Nom est requis' },
        { type: 'minlength', message: 'Minimum 5 caractères' },
        { type: 'ereureNonUnique', message: 'Le nom du projet doit être unique' }
    ],
    'parentName': [
        { type: 'minlength', message: 'Minimum 4 caractères' },
        { type: 'ereurParentNonExistant', message: 'Le nom du projet doit exister' }
    ],
  };



  private initForm(){
    this.newProjectForm = this.fb.group(
      {
        projectName: [
          this.projet.name, 
          Validators.compose([
            Validators.required, 
            Validators.minLength(5),
          ]),
          [this.nomProjetUniqueValidation()]
        ],
        isChild: [
          false
        ],
        parentName: [
          '',
          Validators.compose([
            Validators.minLength(4),
          ]),
          [this.nomParentExist()]
        ],
      },
      {validators: this.validateForm}
    );
  }
}
