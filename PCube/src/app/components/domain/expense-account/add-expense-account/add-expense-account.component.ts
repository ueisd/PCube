import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, ValidationErrors, ValidatorFn, NgControl } from '@angular/forms';
import { ExpenseAccountItem } from 'src/app/models/expense-account';
import * as $ from 'jquery/dist/jquery.min.js';
import { ExpenseAccountService } from 'src/app/services/expense-account/expense-account.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-expense-account',
  templateUrl: './add-expense-account.component.html',
  styleUrls: ['./add-expense-account.component.css']
})
export class AddExpenseAccountComponent implements OnInit {
  autocomplete: ExpenseAccountItem[];

  constructor(private expenseAccountServices: ExpenseAccountService, private dialogRef: MatDialogRef<ExpenseAccountItem>) { }
  ExpenseForm: FormGroup;
  
  @Output() refreshDataEvent = new EventEmitter<boolean>();
  hasToRefresh: boolean = true;


  ngOnInit(
  ): void {
    this.initForm();
    this.isAdded = false;
    this.isUnique = true;
    this.isAddedFailled = false;

  }

  private initForm(){
    this.ExpenseForm = new FormGroup({
      'expenseAccountName': new FormControl(),
      'isChild': new FormControl(),
      'parentName': new FormControl()
    }, {validators: this.validateForm});
  }
  isFormValid: boolean = false;
  isAdded: boolean;
  isAddedFailled: boolean;

  validateForm: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const expenseAccountName = control.get('expenseAccountName').value;
    const isChild = control.get('isChild').value;
    const parentName = control.get('parentName').value;

    if(expenseAccountName == null || expenseAccountName.trim().length == 0){
      this.isFormValid = false;
      return null;
    }

    if(this.isChild){
      this.checkParentExist(parentName);
    }else{
      this.isParentExist = true;
    }

    if(isChild && (parentName == null || parentName.trim().length == 0)){
      this.isFormValid = false;
      return null;
    }
    
    this.isFormValid = true;
    console.log("validator: "+this.isFormValid + this.isChild + this.isUnique)
    return null;
  }

  onSubmit(){
    if(this.ExpenseForm.valid){

      let name: string = this.ExpenseForm.controls['expenseAccountName'].value;
      let isChild: boolean = this.ExpenseForm.controls['isChild'].value;
      let parentName:string = (isChild) ? this.ExpenseForm.controls['parentName'].value: name;

      this.expenseAccountServices.addExpenseAccount(name, parentName).subscribe(expenseAccount => {
          if(expenseAccount.id != -1){
            this.onSubmitSuccess();
          }else{
            this.onSubmitFailled();
          }
      });
    }
  }
  askForDataRefresh() {
    this.refreshDataEvent.emit(this.hasToRefresh);
  }

  private onSubmitSuccess(){
    this.isAdded = true;
    this.askForDataRefresh();
    this.isAddedFailled = false;
    this.ExpenseForm.reset();
    this.dialogRef.close(true);
  }

  private onSubmitFailled(){
    this.isAdded = false;
    this.isAddedFailled = true;
  }


  NameOnChange(newName){}

  async parentNameFocusOut(){
    await this.delay(200);
    this.autocomplete = [];
  }
  
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  private addOrRemoveHiddenClass(id, isHidden){
    console.log(isHidden)
    if(isHidden)
      $("#"+id).addClass("hidden");
    else
      $("#"+id).removeClass("hidden");
  }

  isChild: boolean = false;
  isParentExist: boolean;
  isUnique: boolean;

  isChildChecked(checked: boolean){
    console.log("La variable checked" + checked)
    if(!checked)
      this.ExpenseForm.get('parentName').reset();

    this.isChild = checked
    this.addOrRemoveHiddenClass("parentName-div", !checked);
  }

  autocompleteChoice(event, item){
    console.log(item.name);
    this.ExpenseForm.get('parentName').setValue(item.name);
    this.autocomplete = [];
    this.checkParentExist(item.name);
  }

  checkParentExist(parentName){
    if(parentName != null && parentName.trim().length != 0){
      this.expenseAccountServices.isNameUnique(parentName).subscribe(isUnique => {
        this.isParentExist = !isUnique;
      });
    }
  }

  ExpenseNameOnChange(newValue){
    if(newValue != null && newValue.trim().length != 0){
      this.expenseAccountServices.isNameUnique(newValue).subscribe(isUnique => this.isUnique = isUnique);
    }
  }

}
