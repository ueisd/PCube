import { Component, OnInit, Output, EventEmitter, Optional, Inject } from '@angular/core';
import { FormGroup, FormControl, ValidationErrors, ValidatorFn, NgControl, FormBuilder, Validators, AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { ExpenseAccountItem } from 'src/app/models/expense-account';
import * as $ from 'jquery/dist/jquery.min.js';
import { ExpenseAccountService } from 'src/app/services/expense-account/expense-account.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs/internal/Observable';
import { timer } from 'rxjs/internal/observable/timer';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { map, first } from 'rxjs/operators';
const SEPARATOR: string = " * ";

@Component({
  selector: 'app-add-expense-account',
  templateUrl: './add-expense-account.component.html',
  styleUrls: ['./add-expense-account.component.css']
})
export class AddExpenseAccountComponent implements OnInit {

  @Output() refreshDataEvent = new EventEmitter<boolean>();

  hasToRefresh: boolean = true;
  expenseAccount: ExpenseAccountItem;
  isCreateForm: boolean = false;
  isAddedFailled = false;
  parentOptions: ExpenseAccountItem[];
  validationMessages = {
    'name': [
        { type: 'required', message: 'Un nom est requis' },
        { type: 'minlength', message: 'Minimum 5 caractères' },
        { type: 'ereureNonUnique', message: 'Le nom du compte de dépense doit être unique' }
    ],
    'parent': [],
  };

  canceledMessage = "Canceled";

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data, private fb: FormBuilder,
  private expenseAccountServices: ExpenseAccountService, private dialogRef: MatDialogRef<ExpenseAccountItem>) { }
  ExpenseForm: FormGroup;


  ngOnInit(): void {
    this.expenseAccount = this.data.expenseAccount;
    if(!(this.expenseAccount.id > 0)) this.expenseAccount.id = -1;
    if(!(this.expenseAccount.parent_id > 0)) this.expenseAccount.parent_id = -1;

    if(this.expenseAccount.parent_id === undefined ||  this.expenseAccount.parent_id <= 0) {
      this.isCreateForm = true;
    }
    this.initForm();

    this.expenseAccountServices.getApparentableExpenseAccounts(this.expenseAccount.id).subscribe(accounts =>{
      this.parentOptions = this.generateParentOption(accounts, 0);
      let selected: ExpenseAccountItem = this.findExpenseAccount(this.parentOptions, this.expenseAccount.parent_id);
      if(this.expenseAccount.id != this.expenseAccount.parent_id) {
        this.ExpenseForm.controls['parent'].setValue(selected);
      }
    });
  }


  private initForm(){
    this.ExpenseForm = this.fb.group(
      {
        name: [
          this.expenseAccount.name, 
          Validators.compose([
            Validators.required, 
            Validators.minLength(5),
          ]),
          [this.nomCompteUniqueValidation()]
        ],
        isChild: [
          (this.expenseAccount.parent_id > 0 && this.expenseAccount.parent_id != this.expenseAccount.id)
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

  /* Crée une liste des noeuds de l'arborescence 
   * avec un affichage identé selon le niveua de profondeur @level
   */
  private generateParentOption(acounts: ExpenseAccountItem[], level:number) : ExpenseAccountItem[] {
    if(acounts === null) return [];
    let retour: ExpenseAccountItem[] = [];

    for (var account of acounts) {
      let item : ExpenseAccountItem = new ExpenseAccountItem(account);
      item.child = null;
      item.nomAffichage = item.name;
      for(let i = 0; i<level; i++) {
        item.nomAffichage = SEPARATOR + item.nomAffichage;
      }
      retour.push(item);
      if(account.child && account.child.length) {
        for(var subAccount of this.generateParentOption(account.child, level+1))
          retour.push(subAccount);
      }
    }
    return retour;
  }


  /* Trouve et retourne le ExpenseAccountItem avec id = @id dans une arborescence de account item 
   *  Si ne trouve pas retourne null
   */
  private findExpenseAccount(accounts:ExpenseAccountItem[], id: number) {
    for(let account of accounts){
      if(account.id == id) return account;
      if(account.id != account.parent_id && account.child != null) {
        var trouve : ExpenseAccountItem = null;
        trouve = this.findExpenseAccount(account.child, id);
        return trouve;
      }
    }
    return null;
  }


  askForDataRefresh() {
    this.refreshDataEvent.emit(this.hasToRefresh);
  }


  onSubmit(){
    if(this.ExpenseForm.valid){

      let name: string = this.ExpenseForm.controls['name'].value
      let parentAccout : ExpenseAccountItem = this.ExpenseForm.controls['parent'].value;
      let parentName: string = (parentAccout != null) ? parentAccout.name : name;

      if(this.isCreateForm) {
        let proj :ExpenseAccountItem = new ExpenseAccountItem();
        if(this.ExpenseForm.value['isChild'] == false) {
          proj.parent_id = this.expenseAccount.id;
        }else if(this.ExpenseForm.value['parent']) {
          proj.parent_id = this.ExpenseForm.value['parent']['id'];
        }else {
          proj.parent_id = this.expenseAccount.parent_id;
        }
        proj.name = this.ExpenseForm.value['name'];

        this.expenseAccountServices.addExpenseAccount(proj).subscribe(project => {
          if(project.id != -1){
            this.onSubmitSuccess();
          }else{
            this.onSubmitFailled();
          }
        });
      }else {
        let proj :ExpenseAccountItem = new ExpenseAccountItem();
        proj.id = this.expenseAccount.id
        
        if(this.ExpenseForm.value['isChild'] == false) {
          proj.parent_id = this.expenseAccount.id;
        }else if(this.ExpenseForm.value['parent']) {
          proj.parent_id = this.ExpenseForm.value['parent']['id'];
        }else {
          proj.parent_id = this.expenseAccount.parent_id;
        }
        proj.name = this.ExpenseForm.value['name'];
        this.expenseAccountServices.updateExpenseAccount(proj).subscribe(project => {
          this.onSubmitSuccess();
        });
      }
    }
  }


  private onSubmitSuccess(){
    this.askForDataRefresh();
    this.isAddedFailled = false;
    this.ExpenseForm.reset();
    this.dialogRef.close(true);
  }


  private onSubmitFailled(){
    this.isAddedFailled = true;
  }


  isChildChecked(checked: boolean){
    if(!checked) this.ExpenseForm.get('parent').reset();
    // à mettre lors de modification
    else if(!this.isCreateForm && this.expenseAccount.id != this.expenseAccount.parent_id) {
      let selected: ExpenseAccountItem = this.findExpenseAccount(this.parentOptions, this.expenseAccount.parent_id);
      this.ExpenseForm.controls['parent'].setValue(selected);
    }
  }


  // vérifie qu'un nom de expenseAccount est unique en interrogant le backend
  private nomCompteUniqueValidation(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return timer(500)
        .pipe(
          switchMap(() =>  this.expenseAccountServices.isNameUnique(control.value)
            .pipe(
              map((isUnique: boolean) => {
                return (isUnique || control.value == this.expenseAccount.name) ? null : { ereureNonUnique: true };
              })
            ).pipe(first())
          )
        )
    };
  }


  validateForm: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    return null;
  }
}
