import { ProjectItem } from './project';
import { User } from './user';
import { ActivityItem } from './activity';

export class ReportRequest {
    projects? : ProjectItem[];
    dateDebut? : string;
    dateFin?: string;
    activitys?: ActivityItem[];
    users? : User[];

    constructor(reportResponse?: any) {
        this.projects = reportResponse && reportResponse.projects || [];
        this.dateDebut = reportResponse && reportResponse.dateDebut || "";
        this.dateFin = reportResponse && reportResponse.dateFin || "";
        this.activitys = reportResponse && reportResponse.activitys || [];
        this.users = reportResponse && reportResponse.users || [];
    }
}