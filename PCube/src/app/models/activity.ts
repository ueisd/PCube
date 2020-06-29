export class ActivityItem {
    id : number;
    name : string;

    constructor(activityResponse: any) {
        this.id = activityResponse.id;
        this.name = activityResponse.name;
    }
}