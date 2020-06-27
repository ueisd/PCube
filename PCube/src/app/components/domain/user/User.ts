import { Role } from 'src/app/Model/role';

export class User {
    id : number;
    firstName : string;
    lastName : string;
    email : string;
    role : Role;

    constructor(userResponse: any) {
        this.id = userResponse.id;
        this.firstName = userResponse.first_name;
        this.lastName = userResponse.last_name;
        this.email = userResponse.email;
        this.role = userResponse.role;
    }
}