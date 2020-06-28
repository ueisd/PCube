export class UserForm {
    name:String;
    lname:String;
    email:String;
    password:String;
    confirmPassword:String;
    roleId:number;
    creerUser: boolean;
    
    constructor(name, lname, email, password, confirmPassword, roleId, creerUser){
        this.name = name;
        this.lname = lname;
        this.email = email;
        this.password = password;
        this.confirmPassword = confirmPassword;
        this.roleId = roleId;
        this.creerUser = creerUser;
    }  
}
