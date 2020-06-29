export class ProjectItem {
    id : number;
    name : string;
    parent_id: number;
    child_project: ProjectItem[];

    constructor(projectResponse: any) {
        this.id = projectResponse.id;
        this.name = projectResponse.name;
        this.parent_id = projectResponse.parent_id;
        this.child_project = projectResponse.child;
    }
}