export class Role {
    id: number;
    role_name : string; 
    access_level : number;      

    constructor(id, role_name, access_level){
        this.id = id;
        this.role_name = role_name;
        this.access_level = access_level;
    }
}
