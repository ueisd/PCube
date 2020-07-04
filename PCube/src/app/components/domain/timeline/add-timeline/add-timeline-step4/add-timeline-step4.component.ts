import { Component, OnInit } from '@angular/core';
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

  onEmptyValue(){
    this.message = NORMAL_MESSAGE
    this.messageClasse = NORMAL_CLASS;
    this.account = new ExpenseAccountItem();
    this.accounts = [];
  }

  onNameChange(value){
    let account = new ExpenseAccountItem();
    account.name = value;
    if(value){
      this.callProjectService(account);
    }else{
      this.onEmptyValue();
    }
  }

  onIdChange(value){   
    let account = new ExpenseAccountItem();
    account.id = value
    if(value){
      this.callProjectService(account);
    }else{
      this.onEmptyValue();
    } 
  }

  accounts:ExpenseAccountItem[] = [];
  displayedColumns : string[];

  onNoProjectFound(){
    this.message = "Aucune compte trouvé"
    this.messageClasse = WARNING_CLASS;
  }

  onMultipleProjectFound(){
    this.message = "Veuillez sélectionner une compte."
    this.messageClasse = WARNING_CLASS;
  }

  onProjectFound(){
    this.message = this.account.name;
    this.messageClasse = SUCCESS_CLASS;
  }

  onProjectSubscribtionReceive(accounts:ExpenseAccountItem[], account:ExpenseAccountItem){
    if(accounts.length == 0){
      this.onNoProjectFound();
      return;
    }

    if(accounts.length > 1){
      this.accounts = accounts;
      this.onMultipleProjectFound();
      return;
    }

    if(accounts.length == 1 && (accounts[0].id == account.id || accounts[0].name.toLocaleUpperCase() == account.name.toLocaleUpperCase())){
      this.onProjectFound();
      this.account = accounts[0];
    }
    else
      this.onMultipleProjectFound();
  }

  callProjectService(account:ExpenseAccountItem){

    if(this.isOnRowClicked){
      this.isOnRowClicked = false;
      return;
    }

    this.expenseAccountService.oneLevelFilterExpenseAccount(account).subscribe(accounts => {
      this.accounts = accounts;
      this.onProjectSubscribtionReceive(accounts, account);
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

    this.onProjectFound();

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
}
