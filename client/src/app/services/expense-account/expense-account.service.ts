import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExpenseAccountItem } from 'src/app/models/expense-account';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { DataTreeFetcher } from 'src/app/models/utils/DataTreeFetcher';

const SEPARATOR: string = " * ";

const API_EXPENSE_ACCOUNT = environment.api_url + "/api/expense-account";
const API_IS_UNIQUE = API_EXPENSE_ACCOUNT + "/is-name-unique";
const API_IS_DELETABLE = API_EXPENSE_ACCOUNT + "/is-deletable";


@Injectable({
  providedIn: 'root'
})

export class ExpenseAccountService {

  constructor(private http: HttpClient) { }

  getAllExpenseAccount(): Observable<ExpenseAccountItem[]>{
    let result = this.http.get<ExpenseAccountItem[]>(API_EXPENSE_ACCOUNT).pipe(
      map(projects => projects.map(response => {
          return ExpenseAccountItem.fetchItemFromResponse(response);
        })
      )
    );

    return result;
  }
 
  getParentOptions(id: number): Observable<ExpenseAccountItem[]>{
    return this.getApparentableExpenseAccounts(id).pipe(
      map(
        projets => {
          return this.generateParentOption(projets, 0);
        }
    ));
  }

  

  isNameUnique(name, id): Observable<boolean> {
    let body = {id:id, name: name}; 
    return this.http.post<boolean>(API_IS_UNIQUE, body);
  }

  addExpenseAccount(compte: ExpenseAccountItem): Observable<ExpenseAccountItem>{
    let body = {
      name: compte.name,
      ExpenseAccountId: compte.parent_id,
    }
    return this.http.post<ExpenseAccountItem>(API_EXPENSE_ACCOUNT, body)
  }

  deleteExpenseAccount(id) {
    return this.http.delete(API_EXPENSE_ACCOUNT + "/" + id);
  }

  isExpenseAccountDeletable(id): Observable<boolean> {
    let url = API_IS_DELETABLE + "/" + id;
    return this.http.get<boolean>(url);
  }

  updateExpenseAccount(compte: ExpenseAccountItem): Observable<ExpenseAccountItem>{
    let body = {
      id: compte.id,
      name: compte.name,
      ExpenseAccountId: compte.parent_id,
    }
    return this.http.put<ExpenseAccountItem>(API_EXPENSE_ACCOUNT, body);
  }


  //équivalent de getParentOptions
  private getApparentableExpenseAccounts(id: number): Observable<ExpenseAccountItem[]>{
    return this.getAllExpenseAccount().pipe(
      map(
        projets => DataTreeFetcher.fetchProjectTree({
            itemList: projets,
            fieldsNames : {
                childs:     'child',
                id :        'id',
                parentId :  'parent_id'
            }
          }, id) 
      )
    )
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

}