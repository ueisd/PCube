export class ProjectItem {
    id : number;
    name : string;
    parent_id: number;
    child_project?: ProjectItem[];
    nomAffichage? : string;

    constructor(projectResponse?: any) {
        this.id = projectResponse && projectResponse.id || "";
        this.name = projectResponse && projectResponse.name || "";
        this.parent_id = projectResponse && projectResponse.parent_id || "";
        this.nomAffichage = projectResponse && projectResponse.nomAffichage || "";
        this.child_project = projectResponse && projectResponse.child_project || [];
    }
}