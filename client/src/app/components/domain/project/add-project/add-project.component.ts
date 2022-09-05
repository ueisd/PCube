import { Component, OnInit, Output, EventEmitter, Inject, Optional } from '@angular/core';
import { ProjectService } from 'src/app/services/project/project.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ProjectItem } from '../../../../models/project';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs/internal/operators/map';
import { FormValidatorBuilder } from '../../../utils/FormValidatorBuilder';
import * as _ from 'lodash';
const SEPARATOR = ' * ';

@Component({
  selector: 'app-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css'],
})
export class AddProjectComponent implements OnInit {
  @Output() refreshDataEvent = new EventEmitter<boolean>();

  isCreateForm = false;
  projet: ProjectItem;
  newProjectForm: FormGroup;
  parentOptions: ProjectItem[];
  hasToRefresh = true;
  isAddedFailled = false;
  validationMessages = {};
  errorMessage = null;

  canceledMessage = 'Canceled';

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private projectService: ProjectService, private dialogRef: MatDialogRef<AddProjectComponent>) {}

  async ngOnInit(): Promise<void> {
    this.projet = this.data.projet;
    if (!(this.projet.id > 0)) {
      this.projet.id = -1;
    }
    if (!(this.projet.parent_id > 0)) {
      this.projet.parent_id = -1;
    }

    if (this.projet.id < 0) {
      this.isCreateForm = true;
    }
    this.initForm();

    this.parentOptions = await this.projectService.getParentOptions(this.projet.id).toPromise();

    const selected: ProjectItem = this.findProject(this.parentOptions, this.projet.parent_id);
    if (this.projet.id !== this.projet.parent_id) {
      this.newProjectForm.controls.parent.setValue(selected);
    }
  }

  private initValidators() {
    const validatorBuilder = new FormValidatorBuilder(this.validationMessages);

    const projectNameValidators = validatorBuilder.buildStringValidators({ field: 'projectName', label: 'nom', min: 5, max: 40, required: true });

    const nameUniqueAsyncValidator = validatorBuilder.generateCustomAsyncValidator({
      field: 'projectName',
      validatorFn: (val) => this.projectService.isNameUnique(val).pipe(map((isNameExist) => isNameExist && val !== this.projet.name)),
      error: { type: 'nameAlreadyExist', message: `Le nom n'est pas unique` },
    });

    return { projectNameValidators, nameUniqueAsyncValidator };
  }

  private initForm() {
    const { projectNameValidators, nameUniqueAsyncValidator } = this.initValidators();
    this.newProjectForm = this.fb.group({
      projectName: [this.projet.name, Validators.compose(projectNameValidators), [nameUniqueAsyncValidator]],
      isChild: [this.projet.parent_id > 0 && this.projet.parent_id !== this.projet.id],
      parent: [null],
    });
  }

  /* Trouve et retourne le ProjetItem avec id = @id dans une arborescence de projet
   * Si ne trouve pas retourne null
   */
  private findProject(projets: ProjectItem[], id: number) {
    for (const projet of projets) {
      if (projet.id === id) {
        return projet;
      }
      if (projet.id !== projet.parent_id && projet.child_project != null) {
        let trouve: ProjectItem = null;
        trouve = this.findProject(projet.child_project, id);
        return trouve;
      }
    }
    return null;
  }

  private askForDataRefresh() {
    this.refreshDataEvent.emit(this.hasToRefresh);
  }

  public async onSubmit() {
    if (!this.newProjectForm.invalid) {
      const form = this.newProjectForm.controls;
      const name: string = form.projectName.value;
      const projetParent: ProjectItem = form.parent.value;
      const parentId = _.get(projetParent, 'id', -1);

      if (this.isCreateForm) {
        try {
          const res = await this.projectService.addNewProject(name, parentId).toPromise();
          this.onSubmitSuccess(res);
        } catch (err) {
          this.errorMessage = `${err.error.name} : ${err.error.message}`;
        }
      } else {
        const proj: ProjectItem = new ProjectItem();
        proj.id = this.projet.id;

        if (this.newProjectForm.value.isChild === false || !this.newProjectForm.value.parent) {
          proj.parent_id = -1;
        } else {
          proj.parent_id = this.newProjectForm.value.parent.id;
        }
        proj.name = this.newProjectForm.value.projectName;
        await this.projectService.updateProject(proj).toPromise();
        this.onSubmitSuccess();
      }
    }
  }

  private onSubmitSuccess(project?) {
    this.askForDataRefresh();
    this.newProjectForm.reset();
    this.dialogRef.close(true);
  }

  // gère le champ "parent" par rapport à la spécification est child que l'utilisateur change
  isChildChecked(checked: boolean) {
    if (!checked) {
      this.newProjectForm.get('parent').reset();
    } else if (!this.isCreateForm && this.projet.id !== this.projet.parent_id) {
      const selected: ProjectItem = this.findProject(this.parentOptions, this.projet.parent_id);
      this.newProjectForm.controls.parent.setValue(selected);
    }
  }

  public isFieldError(fieldName, validation, lazy?: boolean) {
    const isFieldError = this.newProjectForm.get(fieldName).hasError(validation.type);
    if (lazy) {
      return isFieldError;
    }

    return isFieldError && (this.newProjectForm.get(fieldName).dirty || this.newProjectForm.get(fieldName).touched);
  }
}
