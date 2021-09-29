export class ProjectItem {
    id : number;
    name : string;
    parent_id: number;
    child_project?: ProjectItem[];
    nomAffichage? : string;
    nbLignesDeTemps? : number;

    constructor(projectResponse?: any) {
        this.id = projectResponse && projectResponse.id || null;
        this.name = projectResponse && projectResponse.name || "";
        this.parent_id = projectResponse && projectResponse.parent_id || "";
        this.nomAffichage = projectResponse && projectResponse.nomAffichage || "";
        this.child_project = projectResponse && projectResponse.child_project || [];
        this.nbLignesDeTemps = projectResponse && projectResponse.nbLignesDeTemps || "";
    }

    static fetchProjectFromResponse(projectResponse?: any) {
        let project = new ProjectItem(projectResponse);
        project.parent_id = projectResponse.ProjectId;
        return project;
    } 

    private static setRecursivelyChildrensFromList(
        project: ProjectItem, 
        projects: ProjectItem[],
        idToExcude?:number
    ) {
        project.child_project = projects.filter(proj => {
            if(idToExcude && idToExcude === proj.id)
                return false;
            return proj.parent_id === project.id;
        });
        for(let proj of project.child_project) {
            this.setRecursivelyChildrensFromList(proj, projects);
        }
    }

    static fetchProjectTree(projects: ProjectItem[], idToExcude?:number): ProjectItem[] {
        let rootProjects = projects.filter(project => {
            if(idToExcude && idToExcude === project.id) 
                return false;
            else
                return project.parent_id === null;
        });
        for(let project of rootProjects) {
            if(idToExcude)
                this.setRecursivelyChildrensFromList(project, projects, idToExcude);
            else
                this.setRecursivelyChildrensFromList(project, projects);
        }
        return rootProjects;
    }
}