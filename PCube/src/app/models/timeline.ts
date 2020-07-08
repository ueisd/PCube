export class TimelineItem{
    id : number;
    day_of_week : string;
    punch_in: string;
    punch_out: string;
    project_id: number;
    accounting_time_category_id: number;
    activity_id: number;
    user_id: number;

    constructor(timelineResponse?: any) {
        this.id = timelineResponse && timelineResponse.id || "";
        this.day_of_week = timelineResponse && timelineResponse.day_of_week || "";
        this.punch_in = timelineResponse && timelineResponse.punch_in || "";;
        this.punch_out = timelineResponse && timelineResponse.punch_out || "";;
        this.project_id = timelineResponse && timelineResponse.project_id || "";;
        this.accounting_time_category_id = timelineResponse && timelineResponse.accounting_time_category_id || "";;
        this.activity_id = timelineResponse && timelineResponse.activity_id || "";;
        this.user_id = timelineResponse && timelineResponse.user_id || "";;
    }

    clone(): TimelineItem {
        let cloned = new TimelineItem();
        cloned.id = this.id;
        cloned.day_of_week = this.day_of_week;
        cloned.punch_in = this.punch_in;
        cloned.punch_out = this.punch_out;
        cloned.project_id = this.project_id;
        cloned.activity_id = this.activity_id;
        cloned.user_id = this.user_id;
        return cloned;
    }
}