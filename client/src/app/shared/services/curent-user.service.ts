import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { User } from "src/app/models/user";
import { CurentUser } from "../models/curent-user.model";

@Injectable()
export class CurentUserService {

    constructor(
        private http: HttpClient,
      ) {
      }

    public curentUser: BehaviorSubject<CurentUser> = new BehaviorSubject<CurentUser>(
        new CurentUser()
    );

    getCurentUserFromApi(): Observable<User> {
        return this.http.get<User>("api/api/user/curent");
    }

    public updateCurentUser(user: any){
        let modified = false;
        if(user.email && this.curentUser.value.email != user.email) {
            this.curentUser.value.email = user.email;
            modified = true;
        }
        if(user.firstName && this.curentUser.value.firstName != user.firstName) {
            this.curentUser.value.firstName = user.firstName;
            modified = true;
        }
        if(user.lastName && this.curentUser.value.lastName != user.lastName) {
            this.curentUser.value.lastName = user.lastName;
            modified = true;
        }
        let accessLevel = user['Role.accessLevel'];
        if(
            accessLevel != undefined  
            && this.curentUser.value.accessLevel != accessLevel) {
            this.curentUser.value.accessLevel = accessLevel;
            modified = true;
        }
        if(modified)
            this.curentUser.next(this.curentUser.value);    
    }

}