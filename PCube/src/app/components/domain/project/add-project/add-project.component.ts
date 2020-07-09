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

  selectedCity: any;
  newProjectForm: FormGroup;
  hasToRefresh: boolean = true;
  projet: ProjectItem;
  isAddedFailled: boolean = false;
  parentNameOptions: ProjectItem[];
  //filteredOptions: Observable<ProjectItem[]>;
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

  generateParentOption(projets: ProjectItem[], level:number) : ProjectItem[] {
    if(projets === null) return [];
    let retour: ProjectItem[] = [];

    for (var projet of projets) {
      let item : ProjectItem = new ProjectItem(projet);
      item.child_project = null;
      item.nomAffichage = item.name;
      for(let i = 0; i<level; i++) {
        item.nomAffichage = " * " + item.nomAffichage;
      }
      retour.push(item);
      if(projet.child_project != undefined && projet.child_project.length != undefined) {
        for(var sprojet of this.generateParentOption(projet.child_project, level+1))
          retour.push(sprojet);
      }
    }
    return retour;
  }

  findProject(projets:ProjectItem[], id: number) {
    for(let projet of projets){
      if(projet.id == id) return projet;
      if(projet.id != projet.parent_id && projet.child_project != null) {
        var trouve : ProjectItem = null;
        trouve = this.findProject(projet.child_project, id);
        return trouve;
      }
    }
    return null;
  }

  ngOnInit(): void {
    this.projet = this.data.projet;
    if(this.projet.parent_id === undefined ||  this.projet.parent_id <= 0) {
      this.isCreateForm = true;
    }
    this.initForm();

    this.projectService.getApparentableProject(this.projet.id).subscribe(projets =>{
      this.parentNameOptions = this.generateParentOption(projets, 0);

      let selected: ProjectItem = this.findProject(this.parentNameOptions, this.projet.parent_id);
      if(this.newProjectForm.value['id'] != this.newProjectForm.value['parent_id']) {
        this.newProjectForm.controls['parentName'].setValue(selected);
      }
    });

  }

  private initForm(){
    this.newProjectForm = this.fb.group(
      {
        id: [
          this.projet.id
        ],
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
          null,
          Validators.compose([]),
          []
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

      let name: string = this.newProjectForm.controls['projectName'].value
      let projetParent : ProjectItem = this.newProjectForm.controls['parentName'].value;
      let parentName: string = (projetParent != null) ? projetParent.name : name;

      if(this.isCreateForm) {
        this.projectService.addNewProject(name, parentName).subscribe(project => {
          if(project.id != -1){
            this.onSubmitSuccess();
          }else{
            this.onSubmitFailled();
          }
        });
      }else {
        let proj :ProjectItem = new ProjectItem();
        proj.id = this.newProjectForm.value['id'];
        
        if(this.newProjectForm.value['isChild'] == false) {
          proj.parent_id = this.projet.id;
        }else if(this.newProjectForm.value['parentName'] != undefined) {
          proj.parent_id = this.newProjectForm.value['parentName']['id'];
        }else {
          proj.parent_id = this.projet.parent_id;
        }
        proj.name = this.newProjectForm.value['projectName'];
        this.projectService.updateProject(proj).subscribe(project => {
          this.onSubmitSuccess();
        });
      }
      
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

  isChildChecked(checked: boolean){
    if(!checked) this.newProjectForm.get('parentName').reset();
    else if(!this.isCreateForm && this.newProjectForm.value['id'] != this.newProjectForm.value['parent_id']) {
      let selected: ProjectItem = this.findProject(this.parentNameOptions, this.projet.parent_id);
      this.newProjectForm.controls['parentName'].setValue(selected);
    }
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
