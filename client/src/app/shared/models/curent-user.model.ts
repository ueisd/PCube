import { User } from "src/app/models/user";

export class CurentUser {
    //autres champs si on a besoin
    user: User

    constructor() {
        this.user = null;
    }
}