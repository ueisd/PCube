import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExpenseAccountItem } from 'src/app/models/expense-account';
import { environment } from 'src/environments/environment';

const API_EXPENSE_ACCOUNT = environment.api_url + "/api/expense-account";
const API_APPARENTABLE = API_EXPENSE_ACCOUNT + environment.api_url + "/getApparentable";
const API_IS_UNIQUE = environment.api_url + "/api/expense-account/is-unique";
const API_AUTOCOMPLTE = environment.api_url + "api/expense-account/autocomplete";
const API_FILTER = environment.api_url + "/api/expense-account/filter";
const API_ONE_LEVEL_FILTER = environment.api_url + "/api/expense-account/filter/one-level";
const API_IS_DELETABLE = environment.api_url + "/api/expense-account/is-deletable";


@Injectable({
  providedIn: 'root'
})

export class ExpenseAccountService {

  constructor(private http: HttpClient) { }

  getAllExpenseAccount(): Observable<ExpenseAccountItem[]>{
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')  // tslint:disable-line:object-literal-key-quotes
      })
    };
    return this.http.get<ExpenseAccountItem[]>(API_EXPENSE_ACCOUNT, opts);
  }

  getApparentableExpenseAccounts(id : number): Observable<ExpenseAccountItem[]>{
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')  // tslint:disable-line:object-literal-key-quotes
      })
    };
    return this.http.get<ExpenseAccountItem[]>(API_APPARENTABLE + "/" + id, opts);
  }

  isNameUnique(name): Observable<boolean> {

    var url = API_IS_UNIQUE + "/" + name
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')  // tslint:disable-line:object-literal-key-quotes
      })
    };
    return this.http.get<boolean>(url, opts);
  }

  getProjectNameForAutocomplete(name): Observable<ExpenseAccountItem[]>{
    var url = API_AUTOCOMPLTE + "/" + name
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')  // tslint:disable-line:object-literal-key-quotes
      })
    };
    return this.http.get<ExpenseAccountItem[]>(url, opts);
  }

  filterExpenseAccount(expenseAccount: ExpenseAccountItem): Observable<ExpenseAccountItem[]>{
    let url = API_FILTER + "?name=" + expenseAccount.name;
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')  // tslint:disable-line:object-literal-key-quotes
      })
    };
    return this.http.get<ExpenseAccountItem[]>(url, opts);
  }

  addExpenseAccount(compte: ExpenseAccountItem): Observable<ExpenseAccountItem>{
    let url = API_EXPENSE_ACCOUNT;
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),  // tslint:disable-line:object-literal-key-quotes
        'Content-Type': 'application/json'
      })
    };
   
    let body = {
      name: compte.name,
      parent_id: compte.parent_id,
    }
    return this.http.post<ExpenseAccountItem>(API_EXPENSE_ACCOUNT, body, opts)
  }

  oneLevelFilterExpenseAccount(expenseAccount: ExpenseAccountItem): Observable<ExpenseAccountItem[]>{
    let url = API_ONE_LEVEL_FILTER + "?name=" + expenseAccount.name;
    url += "&id=" + expenseAccount.id;

    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')  // tslint:disable-line:object-literal-key-quotes
      })
    };
    return this.http.get<ExpenseAccountItem[]>(url, opts);
  }

  deleteExpenseAccount(id, name:string) {
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),  
      }),
      body: {
        id: id,
        name: name
      }
    };

    return this.http.delete(API_EXPENSE_ACCOUNT, opts);
  }

  isExpenseAccountDeletable(id, name:string): Observable<boolean> {
    let url = API_IS_DELETABLE + "/" + id + "/" + name;
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),  
      })
    };

    return this.http.get<boolean>(url, opts);
  }

  updateExpenseAccount(compte: ExpenseAccountItem): Observable<ExpenseAccountItem>{
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),  // tslint:disable-line:object-literal-key-quotes
        'Content-Type': 'application/json'
      })
    };
   
    let body = {
      id: compte.id,
      name: compte.name,
      parent_id: compte.parent_id,
    }
    return this.http.put<ExpenseAccountItem>(API_EXPENSE_ACCOUNT, body, opts);
  }

}