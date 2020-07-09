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
import {NgSelectModule, NgOption} from '@ng-select/ng-select';

@Component({
  selector: 'app-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {

  @Output() refreshDataEvent = new EventEmitter<boolean>();

  selectedCity: any;
  newProjectForm: FormGroup;
  hasToRefresh: boolean = true;
  projet: ProjectItem;
  isAddedFailled: boolean = false;
  parentNameOptions: ProjectItem[];
  filteredOptions: Observable<ProjectItem[]>;
  isCreateForm = false;
  cities = [
    {id: 1, name: 'Vilnius'},
    {id: 2, name: 'Kaunas'},
    {id: 3, name: 'Pavilnys', disabled: true},
    {id: 4, name: 'Pabradė'},
    {id: 5, name: 'Klaipėda'}
  ];
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
    'parent_id': [
    ],
  };

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  private fb: FormBuilder, private projectService: ProjectService, 
  private dialogRef: MatDialogRef<AddProjectComponent>) { 

  }

  ngOnInit(): void {
    this.projet = this.data.projet;
    if(this.projet.parent_id === undefined ||  this.projet.parent_id <= 0) {
      this.isCreateForm = true;
    }
    this.initForm();

    this.projectService.getAllProject().subscribe(projets =>{
      this.parentNameOptions = projets;
      //projets.map((val)=> val.name);

      this.filteredOptions = this.newProjectForm.get('parentName').valueChanges
      .pipe(
        startWith(''),
        map(value => {
          return this._filter(value)
        } )
      );
    });

  }

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
          (this.projet.parent_id > 0 && this.projet.parent_id != this.projet.id)
        ],
        parentName: [
          '',
          Validators.compose([
            Validators.minLength(4),
          ]),
          [this.nomParentExist()]
        ],
        parent_id: [
          this.projet.parent_id,
          Validators.compose([]),
          [] //vérifier si est descendant
        ],
      },
      {validators: this.validateForm}
    );
  }

  askForDataRefresh() {
    this.refreshDataEvent.emit(this.hasToRefresh);
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

  private onSubmitSuccess(){
    this.askForDataRefresh();
    this.isAddedFailled = false;
    this.newProjectForm.reset();
    this.dialogRef.close(true);
  }

  private onSubmitFailled(){
    this.isAddedFailled = true;
  }

  private _filter(value: string): ProjectItem[] {
    const filterValue = value.toLowerCase();
    return this.parentNameOptions.filter(option => option.name.toLowerCase().includes(filterValue));
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
                return (isUnique || control.value == this.projet.name) ? null : { ereureNonUnique: true };
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


  
}
