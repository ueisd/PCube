export class ReportItem {
    id : number;
    name : string;
    parent_id: number;
    summline: number;
    sumTotal: number;
    child?: ReportItem[];

    constructor(reportItemResponse?: any) {
        this.id = reportItemResponse && reportItemResponse.id || "";
        this.name = reportItemResponse && reportItemResponse.name || "";
        this.parent_id = reportItemResponse && reportItemResponse.parent_id || "";
        this.summline = reportItemResponse && reportItemResponse.summline || 0;
        this.sumTotal = reportItemResponse && reportItemResponse.sumTotal || 0;
        this.child = reportItemResponse && reportItemResponse.child || [];
    }
}