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
        this.first_name = userResponse && userResponse.first_name || "";
        this.last_name = userResponse && userResponse.last_name || "";
        this.email = userResponse && userResponse.email || "";
        this.role_id = userResponse && userResponse.role_id || "";
        this.role_name = userResponse && userResponse.role_name || "";
        this.display_string = userResponse && userResponse.display_string || "";
    }
}