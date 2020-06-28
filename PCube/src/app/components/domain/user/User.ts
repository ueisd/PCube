import { Role } from 'src/app/Model/role';

export class User {
    id : number;
    firstName : string;
    lastName : string;
    email : string;
    roleId : number;
    roleName : string;

    constructor(userResponse: any) {
        this.id = userResponse.id;
        this.firstName = userResponse.first_name;
        this.lastName = userResponse.last_name;
        this.email = userResponse.email;
        this.roleId = userResponse.role_id;
        this.roleName = userResponse.role_name;
    }
}