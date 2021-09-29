export class Role {
    id: number;
    role_name : string; 
    access_level : number;      

    constructor(id, role_name, access_level){
        this.id = id;
        this.role_name = role_name;
        this.access_level = access_level;
    }

    static fetchFromRoleResponse(roleResponse:any):Role {
        let id = roleResponse && roleResponse.id || 0;
        let role_name = roleResponse && roleResponse.name || "";
        let access_level = roleResponse && roleResponse.accessLevel || 0;
        return new Role(id, role_name, access_level);
    }


}
