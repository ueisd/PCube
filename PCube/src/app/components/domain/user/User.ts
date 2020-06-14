export class User {
    firstName : string;
    lastName : string;
    email : string;
    role : string;

    constructor(userResponse: any) {
        this.firstName = userResponse.first_name;
        this.lastName = userResponse.last_name;
        this.role = userResponse.role;
    }
}