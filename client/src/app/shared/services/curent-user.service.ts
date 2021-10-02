import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/internal/operators/map";
import { User } from "src/app/models/user";
import { CurentUser } from "../models/curent-user.model";

@Injectable()
export class CurentUserService {

    constructor(private http: HttpClient) {}

    public curentUser: BehaviorSubject<CurentUser> = new BehaviorSubject<CurentUser>(
        new CurentUser()
    );

    getCurentUserFromApi(): Observable<User> {
        return this.http.get<User>("api/api/user/curent").pipe(map(
            item => new User(item)  
        ));
    }

    public updateCurentUser(user: User){
        let modified = false;
        if(user.email && this.curentUser.value.email != user.email) {
            this.curentUser.value.email = user.email;
            modified = true;
        }
        if(user.first_name && this.curentUser.value.firstName != user.first_name) {
            this.curentUser.value.firstName = user.first_name;
            modified = true;
        }
        if(user.last_name && this.curentUser.value.lastName != user.last_name) {
            this.curentUser.value.lastName = user.last_name;
            modified = true;
        }

        if(user.role_name && this.curentUser.value.roleName != user.role_name) {
            this.curentUser.value.roleName = user.role_name;
            modified = true;
        }
        let accessLevel = user.role_access_level;
        if(accessLevel != undefined  
            && this.curentUser.value.accessLevel != accessLevel
        ) {
            this.curentUser.value.accessLevel = accessLevel;
            modified = true;
        }
        console.log(this.curentUser.value);
        if(modified)
            this.curentUser.next(this.curentUser.value);    
    }

}