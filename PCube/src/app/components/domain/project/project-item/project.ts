export class ProjectItem {
    id : number;
    name : string;
    parent_id: number;

    constructor(activityResponse: any) {
        this.id = activityResponse.id;
        this.name = activityResponse.name;
        this.parent_id = activityResponse.parent_id;
    }
}