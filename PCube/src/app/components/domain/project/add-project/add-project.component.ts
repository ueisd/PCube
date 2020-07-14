import { Component, OnInit, Output, EventEmitter, Inject, Optional } from '@angular/core';
import { ProjectService } from 'src/app/services/project/project.service';
import { FormControl, FormGroup, Validators, ValidatorFn, ValidationErrors, FormBuilder, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { ProjectItem } from '../../../../models/project';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { __values } from 'tslib';
import { map } from 'rxjs/internal/operators/map';
import { Observable } from 'rxjs/internal/Observable';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { timer } from 'rxjs/internal/observable/timer';
import { first } from 'rxjs/internal/operators/first';
const SEPARATOR: string = " * ";

@Component({
  selector: 'app-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {

  @Output() refreshDataEvent = new EventEmitter<boolean>();

  isCreateForm = false;
  projet: ProjectItem;
  newProjectForm: FormGroup;
  parentOptions: ProjectItem[];
  hasToRefresh: boolean = true;
  isAddedFailled: boolean = false;
  validationMessages = {
    'projectName': [
        { type: 'required', message: 'Une Nom est requis' },
        { type: 'minlength', message: 'Minimum 5 caractères' },
        { type: 'ereureNonUnique', message: 'Le nom du projet doit être unique' }
    ],
    'parent': [],
  };


  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  private fb: FormBuilder, private projectService: ProjectService, 
  private dialogRef: MatDialogRef<AddProjectComponent>) { }

  
  ngOnInit(): void {
    this.projet = this.data.projet;
    if(!(this.projet.id > 0)) this.projet.id = -1;
    if(!(this.projet.parent_id > 0)) this.projet.parent_id = -1;

    if(this.projet.parent_id === undefined ||  this.projet.parent_id <= 0) {
      this.isCreateForm = true;
    }
    this.initForm();

    this.projectService.getApparentableProject(this.projet.id).subscribe(projets =>{
      this.parentOptions = this.projectService.generateParentOption(projets, 0);

      let selected: ProjectItem = this.findProject(this.parentOptions, this.projet.parent_id);
      if(this.projet.id != this.projet.parent_id) {
        this.newProjectForm.controls['parent'].setValue(selected);
      }
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
        parent: [
          null,
          Validators.compose([]),
          []
        ],
      },
      {validators: this.validateForm}
    );
  }


  /* Trouve et retourne le ProjetItem avec id = @id dans une arborescence de projet 
   *  Si ne trouve pas retourne null
   */
  private findProject(projets:ProjectItem[], id: number) {
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


  private askForDataRefresh() {
    this.refreshDataEvent.emit(this.hasToRefresh);
  }


  public onSubmit(){
    if(this.newProjectForm.valid){

      let name: string = this.newProjectForm.controls['projectName'].value
      let projetParent : ProjectItem = this.newProjectForm.controls['parent'].value;
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
        proj.id = this.projet.id
        
        if(this.newProjectForm.value['isChild'] == false) {
          proj.parent_id = this.projet.id;
        }else if(this.newProjectForm.value['parent'] != undefined) {
          proj.parent_id = this.newProjectForm.value['parent']['id'];
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


  // gère le champ "parent" par rapport à la spécification est child que l'utilisateur change
  isChildChecked(checked: boolean){
    if(!checked) this.newProjectForm.get('parent').reset();
    else if(!this.isCreateForm && this.projet.id != this.projet.parent_id) {
      let selected: ProjectItem = this.findProject(this.parentOptions, this.projet.parent_id);
      this.newProjectForm.controls['parent'].setValue(selected);
    }
  }


  // vérifie qu'un nom de projet est unique en interrogant le backend
  private nomProjetUniqueValidation(): AsyncValidatorFn {
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

  // validateur global return null quand aucune erreure n'existe
  private validateForm: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    return null;
  }
}
