import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExpenseAccountItem } from 'src/app/models/expense-account';

const API_EXPENSE_ACCOUNT = "/api/expense-account";
const API_IS_UNIQUE = "api/expense-account/is-unique";
const API_AUTOCOMPLTE = "api/expense-account/autocomplete";
const API_FILTER = "/api/expense-account/filter";
const API_ONE_LEVEL_FILTER = "/api/expense-account/filter/one-level";
const API_IS_DELETABLE = "/api/project/is-deletable";


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

  addExpenseAccount(name, parent_name): Observable<ExpenseAccountItem>{
    let url = API_EXPENSE_ACCOUNT;
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),  // tslint:disable-line:object-literal-key-quotes
        'Content-Type': 'application/json'
      })
    };
    let body = {
      name: name,
      parent_name: parent_name
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
    var url = API_IS_DELETABLE + "/" + id + "/" + name;
    const opts = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),  
      })
    };

    return this.http.get<boolean>(url, opts);
  }
}