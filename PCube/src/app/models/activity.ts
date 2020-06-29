export class ActivityItem {
    id : number;
    name : string;

    constructor(activityResponse?: any) {
        this.id = activityResponse && activityResponse.id || -1;
        this.name = activityResponse && activityResponse.name || "";
    }
}