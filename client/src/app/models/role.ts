export class Role {
    id: number;
    name : string; 
    access_level : number;      

    constructor(id, name, access_level){
        this.id = id;
        this.name = name;
        this.access_level = access_level;
    }

    static fetchFromRoleResponse(roleResponse:any):Role {
        let id = roleResponse && roleResponse.id || 0;
        let name = roleResponse && roleResponse.name || "";
        let access_level = roleResponse && roleResponse.accessLevel || 0;
        return new Role(id, name, access_level);
    }


}
