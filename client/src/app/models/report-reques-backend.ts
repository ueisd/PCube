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

    static buildFromReportRequest(report: ReportRequest) : ReportRequestForBackend {
        let repReq = new ReportRequestForBackend();
        if(report.dateDebut) repReq.dateDebut = report.dateDebut;
        else repReq.dateDebut = "";
        if(report.dateFin) repReq.dateFin = report.dateFin;
        else repReq.dateFin = "";
        repReq.projects = [];
        for(let projet of report.projects)
        repReq.projects.push(projet.id);
        
        repReq.users = [];
        for(let user of report.users)
        repReq.users.push(user.id);
        
        repReq.activitys = []
        for(let activity of report.activitys)
        repReq.activitys.push(activity.id);
        return repReq;
    }
}