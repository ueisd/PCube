export class Role {
    id: number;
    name : string; 
    accessLevel : number;      

    constructor(id, name, accessLevel){
        this.id = id;
        this.name = name;
        this.accessLevel = accessLevel;
    }

    static fetchFromRoleResponse(roleResponse:any):Role {
        let id = roleResponse && roleResponse.id || 0;
        let name = roleResponse && roleResponse.name || "";
        let accessLevel = roleResponse && roleResponse.accessLevel || 0;
        return new Role(id, name, accessLevel);
    }


}
