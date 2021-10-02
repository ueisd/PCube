export class User {
    id : number;
    first_name : string;
    last_name : string;
    email : string;
    role_id : number;
    role_name : string;
    role_access_level : number
    display_string?: string;

    constructor(userResponse?: any) {
        this.id = userResponse && userResponse.id || "";
        this.first_name = userResponse && userResponse.firstName || "";
        this.last_name = userResponse && userResponse.lastName || "";
        this.email = userResponse && userResponse.email || "";
        this.role_id = userResponse && userResponse["RoleId"] || "";
        this.role_name = userResponse && userResponse["Role.name"] || "";
        this.role_access_level = userResponse && userResponse["Role.accessLevel"] || ""; 
        this.display_string = this.first_name + " " + this.last_name;
    }
}