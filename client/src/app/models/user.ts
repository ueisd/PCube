import { Role } from "./role";

export class User {
    id : number;
    first_name : string;
    last_name : string;
    email : string;
    role : Role
    //role_id : number;
    //role_name : string;
    //role_access_level : number
    display_string?: string;

    constructor(userResponse?: any) {
        this.id = userResponse && userResponse.id || "";
        this.first_name = userResponse && userResponse.firstName || "";
        this.last_name = userResponse && userResponse.lastName || "";
        this.email = userResponse && userResponse.email || "";
        this.role = new Role(
            (userResponse) ? userResponse["RoleId"] : -1,
            (userResponse) ? userResponse["Role.name"] : "",
            (userResponse) ? userResponse["Role.accessLevel"] : 0
        );
        this.display_string = this.first_name + " " + this.last_name;
    }

    getFullName() {
        let name = [this.first_name, this.last_name];
        return name.join(" ").trim();
    }

    equals(user:User):boolean {
        return (
            (user.id && this.id != user.id) 
            ||
            (user.email && this.email != user.email) 
            ||
            (user.first_name && this.first_name != user.first_name) 
            ||
            (user.last_name && this.last_name != user.last_name) 
            ||
            (user.role.role_name && this.role.role_name != user.role.role_name)
            ||
            (user.role.id && this.role.id != user.role.id)
            ||
            (
                user.display_string 
                && this.display_string != user.display_string
            )
            ||
            (
                user.role.access_level 
                && this.role.access_level  != user.role.access_level 
            )
        );
    }
}