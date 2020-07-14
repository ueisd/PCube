import { ReportRequest } from './report-request';

export class ReportRequestForBackend {
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

    buildFromReportRequest(report: ReportRequest) {
        if(report.dateDebut) this.dateDebut = report.dateDebut;
        else this.dateDebut = "";
        if(report.dateFin) this.dateFin = report.dateFin;
        else this.dateFin = "";
        this.projects = [];
        for(let projet of report.projects)
            this.projects.push(projet.id);
        
        this.users = [];
        for(let user of report.users)
            this.users.push(user.id);
        
        this.activitys = []
        for(let activity of report.activitys)
            this.activitys.push(activity.id);
    }

    
}