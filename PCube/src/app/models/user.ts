export class User {
    id : number;
    firstName : string;
    lastName : string;
    email : string;
    roleId : number;
    roleName : string;

    constructor(userResponse?: any) {
        this.id = userResponse && userResponse.id || 0;
        this.firstName = userResponse && userResponse.first_name || "";
        this.lastName = userResponse && userResponse.last_name || "";
        this.email = userResponse && userResponse.email || "";
        this.roleId = userResponse && userResponse.role_id || "";
        this.roleName = userResponse && userResponse.role_name || "";
    }
}