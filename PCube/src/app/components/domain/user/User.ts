export class User {
    id : number;
    firstName : string;
    lastName : string;
    email : string;
    role : string;

    constructor(userResponse: any) {
        this.id = userResponse.id;
        this.firstName = userResponse.first_name;
        this.lastName = userResponse.last_name;
        this.email = userResponse.email;
        this.role = userResponse.role;
    }
}