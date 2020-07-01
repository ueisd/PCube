import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExpenseAccountItem } from 'src/app/models/expense-account';

const API_EXPENSE_ACCOUNT = "/api/expense-account";
const API_IS_UNIQUE = "api/expense-account/is-unique";
const API_AUTOCOMPLTE = "api/expense-account/autocomplete";
const API_FILTER = "/api/expense-account/filter";

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
}