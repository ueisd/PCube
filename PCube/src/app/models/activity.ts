export class ActivityItem {
    id : number;
    name : string;

    constructor(activityResponse?: any) {
        this.id = activityResponse && activityResponse.id || "";
        this.name = activityResponse && activityResponse.name || "";
    }
}