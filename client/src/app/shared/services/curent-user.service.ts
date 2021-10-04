import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/internal/operators/map";
import { User } from "src/app/models/user";
import { CurentUser } from "../models/curent-user.model";

import { environment } from 'src/environments/environment';
const API_USER = environment.api_url + "/api/user";
const API_USER_CURRENT = API_USER + "/curent";


@Injectable()
export class CurentUserService {

    constructor(private http: HttpClient) {}

    public curentUser: BehaviorSubject<CurentUser> = new BehaviorSubject<CurentUser>(
        new CurentUser()
    );

    getCurentUserFromApi(): Observable<User> {
        return this.http.get<User>(API_USER_CURRENT).pipe(map(
            item => new User(item)  
        ));
    }

    public updateCurentUser(user: User){
        let curentUser = this.curentUser.value.user;
        let modified = false;
        if(!curentUser) {
            modified = true;
        }else {
            modified = !user.equals(curentUser);
        }
        if(modified) {
            this.curentUser.value.user = user;
            this.curentUser.next(this.curentUser.value);
        }
    }

}