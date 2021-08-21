export class ActivityItem {
    id : number;
    name : string;
    nbLignesDeTemps : number;

    constructor(activityResponse?: any) {
        this.id = activityResponse && activityResponse.id || "";
        this.name = activityResponse && activityResponse.name || "";
        this.nbLignesDeTemps = activityResponse && activityResponse.nbLignesDeTemps || "";
    }
}