import { Role } from "./role";

export class User {
    id : number;
    firstName : string;
    lastName : string;
    email : string;
    role : Role
    display_string?: string;

    constructor(userResponse?: any) {
        this.id = userResponse && userResponse.id || "";
        this.firstName = userResponse && userResponse.firstName || "";
        this.lastName = userResponse && userResponse.lastName || "";
        this.email = userResponse && userResponse.email || "";
        this.role = new Role(
            (userResponse) ? userResponse["RoleId"] : -1,
            (userResponse) ? userResponse["Role.name"] : "",
            (userResponse) ? userResponse["Role.accessLevel"] : 0
        );
        this.display_string = this.firstName + " " + this.lastName;
    }

    getFullName() {
        let name = [this.firstName, this.lastName];
        return name.join(" ").trim();
    }

    equals(user:User):boolean {
        return (
            (user.id && this.id != user.id) 
            ||
            (user.email && this.email != user.email) 
            ||
            (user.firstName && this.firstName != user.firstName) 
            ||
            (user.lastName && this.lastName != user.lastName) 
            ||
            (user.role.name && this.role.name != user.role.name)
            ||
            (user.role.id && this.role.id != user.role.id)
            ||
            (
                user.display_string 
                && this.display_string != user.display_string
            )
            ||
            (
                user.role.accessLevel 
                && this.role.accessLevel  != user.role.accessLevel 
            )
        );
    }
}