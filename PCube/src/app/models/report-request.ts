export class ReportRequest {
    projects? : number[];
    dateDebut? : string;
    dateFin?: string;
    activitys?: number[];
    users? : number[];

    constructor(reportResponse?: any) {
        this.projects = reportResponse && reportResponse.projects || [];
        this.dateDebut = reportResponse && reportResponse.dateDebut || "";
        this.dateFin = reportResponse && reportResponse.dateFin || "";
        this.activitys = reportResponse && reportResponse.activitys || [];
        this.users = reportResponse && reportResponse.users || [];
    }
}