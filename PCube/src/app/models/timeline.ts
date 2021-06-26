import { FormControl, FormGroup, Validators } from "@angular/forms";
import { connectableObservableDescriptor } from "rxjs/internal/observable/ConnectableObservable";
import { ActivityItem } from "./activity";
import { ExpenseAccountItem } from "./expense-account";
import { ProjectItem } from "./project";
import { User } from "./user";

export class TimelineItem{
    id : number;
    day_of_week : string;
    punch_in: string;
    punch_out: string;
    project_id: number;
    expense_account_id: number;
    activity_id: number;
    user_id: number;

    constructor(timelineResponse?: any) {
        this.id = timelineResponse && timelineResponse.id || "";
        this.day_of_week = timelineResponse && timelineResponse.day_of_week || "";
        this.punch_in = timelineResponse && timelineResponse.punch_in || "";;
        this.punch_out = timelineResponse && timelineResponse.punch_out || "";;
        this.project_id = timelineResponse && timelineResponse.project_id || "";;
        this.expense_account_id = timelineResponse && timelineResponse.expense_account_id || "";;
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

    static asFormGroup(
        timeline: TimelineItem, 
        activitys: ActivityItem[], 
        projets : ProjectItem[],
        comptes : ExpenseAccountItem[],
        users: User[]
    ): FormGroup {
        let activity = activitys.find(elem => elem.id === timeline.activity_id);
        let project = projets.find(elem => elem.id === timeline.activity_id);
        let compte = comptes.find(elem => elem.id === timeline.expense_account_id);
        let user = users.find(elem => elem.id === timeline.user_id);

        const fg = new FormGroup({
            id: new FormControl(timeline.id, Validators.required),
            day_of_week: new FormControl(timeline.day_of_week, Validators.required),
            punch_in: new FormControl(timeline.punch_in, Validators.required),
            punch_out: new FormControl(timeline.punch_out, Validators.required),
            activity_id: new FormControl(activity, Validators.required),
            project_id: new FormControl(project, Validators.required),
            expense_account_id: new FormControl(compte, Validators.required),
            user_id: new FormControl(user, Validators.required),
        });
        return fg;
      }
}