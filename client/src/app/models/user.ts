export class User {
    id : number;
    first_name : string;
    last_name : string;
    email : string;
    role_id : number;
    role_name : string;
    display_string?: string;

    constructor(userResponse?: any) {
        this.id = userResponse && userResponse.id || "";
        this.first_name = userResponse && userResponse.firstName || "";
        this.last_name = userResponse && userResponse.lastName || "";
        this.email = userResponse && userResponse.email || "";
        this.role_id = userResponse && userResponse["Role.id"] || "";
        this.role_name = userResponse && userResponse["Role.name"] || ""; 
        this.display_string = this.first_name + " " + this.last_name;
    }
}