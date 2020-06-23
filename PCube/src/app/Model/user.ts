export class User {
    name:String;
   lname:String;
   email:String;
   password:String;
   roleId:number;
   creerUser: boolean;

   constructor(name, lname, email, password, roleId, creerUser){
    this.name = name;
    this.lname = lname;
    this.email = email;
    this.password = password;
    this.roleId = roleId;
    this.creerUser = creerUser;
   }
}
