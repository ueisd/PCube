export class CurentUser {
    email: string;
    firstName: string;
    lastName: string;
    accessLevel: number;

    constructor() {
        this.email = '';
        this.firstName = '';
        this.lastName = '';
        this.accessLevel = 0;
    }

    getFullName() {
        let name = [];
        if(this.firstName)
            name.push(this.firstName);
        if(this.lastName)
            name.push(this.lastName);
        if(name.length >0)
        return name.join(" ");
    }
}