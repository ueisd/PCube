export class CurentUser {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    accessLevel: number;
    roleName:string;

    constructor() {
        this.id = -1;
        this.email = '';
        this.firstName = '';
        this.lastName = '';
        this.accessLevel = 0;
        this.roleName = "";
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