export class TimelineFilterItem{
    day_of_week : string;
    project_name: string;
    accounting_time_category_name: string;
    activity_name: string;
    member_name: string;

    constructor() {
        this.day_of_week = "";
        this.project_name = "";
        this.accounting_time_category_name = "";
        this.activity_name = "";
        this.member_name = "";
    }
}