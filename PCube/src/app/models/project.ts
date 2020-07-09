export class ProjectItem {
    id : number;
    name : string;
    parent_id: number;
    child_project?: ProjectItem[];

    constructor(projectResponse?: any) {
        this.id = projectResponse && projectResponse.id || "";
        this.name = projectResponse && projectResponse.name || "";
        this.parent_id = projectResponse && projectResponse.parent_id || "";
        this.child_project = projectResponse && projectResponse.child_project || [];
    }
}