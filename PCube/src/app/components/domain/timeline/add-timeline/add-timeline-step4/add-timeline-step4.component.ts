import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ExpenseAccountService } from 'src/app/services/expense-account/expense-account.service';
import { ExpenseAccountItem } from 'src/app/models/expense-account';
import { FormControl } from '@angular/forms';

const NORMAL_CLASS = "alert-primary";
const SUCCESS_CLASS = "alert-success";
const WARNING_CLASS = "alert-warning";
const DANGER_CLASS = "alert-danger";

const FOCUSED_CLASS = "on-focus";
const NOT_FOCUSED_CLASS = "not-on-focus";

const NORMAL_MESSAGE = "Veuillez saisir un compte";

@Component({
  selector: 'app-add-timeline-step4',
  templateUrl: './add-timeline-step4.component.html',
  styleUrls: ['../add-timeline.component.css']
})
export class AddTimelineStep4Component implements OnInit {

  @Output() isFormValidEvent = new EventEmitter<boolean>();
  @Output() ouputExpenseAccount = new EventEmitter<ExpenseAccountItem>();

  constructor(
    private expenseAccountService: ExpenseAccountService
  ) { }

  isSearchByName:boolean = true;

  message:string = NORMAL_MESSAGE;
  messageClasse:string = NORMAL_CLASS;

  idClass:string = NOT_FOCUSED_CLASS;
  nameClass:string = FOCUSED_CLASS;

  name = new FormControl();
  id = new FormControl();

  public account:ExpenseAccountItem = new ExpenseAccountItem();

  ngOnInit(): void {
    this.displayedColumns = ['id','name', 'parent_id'];
  }

  callOuputEvent(isSuccess){
    this.isFormValidEvent.emit(isSuccess);
    this.ouputExpenseAccount.emit(this.account);
  }

  onEmptyValue(){
    this.message = NORMAL_MESSAGE
    this.messageClasse = NORMAL_CLASS;
    this.account = new ExpenseAccountItem();
    this.accounts = [];
    this.callOuputEvent(false);
  }

  onNameChange(value){
    let account = new ExpenseAccountItem();
    account.name = value;
    if(value){
      this.callAccountService(account);
    }else{
      this.onEmptyValue();
    }
  }

  onIdChange(value){   
    let account = new ExpenseAccountItem();
    account.id = value
    if(value){
      this.callAccountService(account);
    }else{
      this.onEmptyValue();
    } 
  }

  accounts:ExpenseAccountItem[] = [];
  displayedColumns : string[];

  onNoAccountFound(){
    this.message = "Aucune compte trouvé"
    this.messageClasse = WARNING_CLASS;
    this.callOuputEvent(false);
  }

  onMultipleAccountFound(){
    this.message = "Veuillez sélectionner une compte."
    this.messageClasse = WARNING_CLASS;
    this.callOuputEvent(false);
  }

  onAccountFound(){
    this.message = this.account.name;
    this.messageClasse = SUCCESS_CLASS;
    this.callOuputEvent(true);
  }

  onAccountSubscribtionReceive(accounts:ExpenseAccountItem[], account:ExpenseAccountItem){
    if(accounts.length == 0){
      this.onNoAccountFound();
      return;
    }

    if(accounts.length > 1 && !this.isItemAlreadyFound){
      this.accounts = accounts;
      this.onMultipleAccountFound();
      return;
    }

    if(accounts.length >= 1 && this.isItemAlreadyFound){
      this.account = accounts.find(a => a.id == account.id || a.name == account.name)
      this.accounts = [account];
      this.onAccountFound();
      this.isItemAlreadyFound = false;
      return;
    }

    if(accounts.length == 1 && (accounts[0].id == account.id || accounts[0].name.toLocaleUpperCase() == account.name.toLocaleUpperCase())){
      this.account = accounts[0];
      this.onAccountFound();
    }
    else
      this.onMultipleAccountFound();
  }

  callAccountService(account:ExpenseAccountItem){

    if(this.isOnRowClicked){
      this.isOnRowClicked = false;
      return;
    }

    this.expenseAccountService.oneLevelFilterExpenseAccount(account).subscribe(accounts => {
      this.accounts = accounts;
      this.onAccountSubscribtionReceive(accounts, account);
    }, error =>{
      this.message = "Une erreur est survenue, veuillez réessayer."
      this.messageClasse = DANGER_CLASS;
      this.accounts = [];
    })
  }

  isOnRowClicked: boolean = false;

  onRowClicked(account){
    this.isOnRowClicked = true;
    this.accounts = [account];
    this.account = account;

    if(this.isSearchByName){
      this.name.setValue(account.name);
    }else{
      this.id.setValue(account.id);
    }

    this.onAccountFound();

  }

  onIdClick(){
    this.isSearchByName = false;
    this.changeToggleTexteDisplay(this.isSearchByName);
  }

  onNameClick(){
    this.isSearchByName = true;
    this.changeToggleTexteDisplay(this.isSearchByName);
  }

  changeToggleTexteDisplay(searchValue:boolean){
    this.nameClass = (searchValue) ? FOCUSED_CLASS : NOT_FOCUSED_CLASS;
    this.idClass = (!searchValue) ? FOCUSED_CLASS : NOT_FOCUSED_CLASS;
  }

  searchToggle(){
    this.changeToggleTexteDisplay(!this.isSearchByName);
    if(!this.isSearchByName){
      this.onNameChange(this.name.value);
    }else{
      this.onIdChange(this.id.value);
    }
  }

  isItemAlreadyFound:boolean = false;

  setAlreadyFoundItem(isSearchByName:boolean, info:string){
    this.isItemAlreadyFound = true;
    this.isSearchByName = isSearchByName;
    this.changeToggleTexteDisplay(isSearchByName);
    if(isSearchByName){
      this.name.setValue(info);
      this.onNameChange(info);
    }
    else{
      this.id.setValue(info);
      this.onIdChange(info);
    }
  }
}
