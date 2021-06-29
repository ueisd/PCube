import { FormControl, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { ActivityItem } from "./activity";
import { ExpenseAccountItem } from "./expense-account";
import { ProjectItem } from "./project";
import { User } from "./user";
import { formatDate } from "@angular/common";
import { DateManip } from "../utils/date-manip";

const format = 'yyyy-MM-dd';
const locale = 'en-US';

export class TimelineItem{
    id : number = 0;
    day_of_week : string;
    punch_in: string;
    punch_out: string;
    project_id: number;
    expense_account_id: number;
    activity_id: number;
    user_id: number;
    isChanged: boolean = false;

    constructor(timelineResponse?: any) {
        this.id = timelineResponse && timelineResponse.id || 0;
        this.day_of_week = timelineResponse && timelineResponse.day_of_week || "";
        this.punch_in = timelineResponse && timelineResponse.punch_in || "";
        this.punch_out = timelineResponse && timelineResponse.punch_out || "";
        this.project_id = timelineResponse && timelineResponse.project_id || "";
        this.expense_account_id = timelineResponse && timelineResponse.expense_account_id || "";
        this.activity_id = timelineResponse && timelineResponse.activity_id || "";
        this.user_id = timelineResponse && timelineResponse.user_id || "";
        if(timelineResponse && timelineResponse.isChanged) this.isChanged = timelineResponse.isChanged;
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
        cloned.isChanged = this.isChanged;
        return cloned;
    }

    static builFromFormGroup(item: any): TimelineItem {
        let buildedItem = new TimelineItem(item);
        if(item.id) buildedItem.id = item.id;
        if(item.project_id) buildedItem.project_id = item.project_id.id;
        if(item.activity_id) buildedItem.activity_id = item.activity_id.id;
        if(item.user_id) buildedItem.user_id = item.user_id.id;
        if(item.expense_account_id) buildedItem.expense_account_id = item.expense_account_id.id;
        buildedItem.day_of_week = formatDate(item.day_of_week, format, locale);
        return buildedItem;
    }

    static isUnchanged(data: any) {
        return (formatDate(data.day_of_week, format, locale) === data.oldValue.day_of_week)
        && (data.punch_in === data.oldValue.punch_in)
        && (data.punch_out === data.oldValue.punch_out)    
        && (
            (data.activity_id == null && data.oldValue.activity_id == "") 
            || (data.activity_id && data.activity_id.id === data.oldValue.activity_id)
           )                                                                        
        && (
            (data.expense_account_id == null && data.oldValue.expense_account_id == "") 
            || (data.expense_account_id && data.expense_account_id.id === data.oldValue.expense_account_id)
           )                                                  
        && (
            (data.user_id == null && data.oldValue.user_id == "") 
            || (data.user_id && data.user_id.id === data.oldValue.user_id)
           )
        && (
            (data.project_id == null && data.oldValue.project_id == "") 
            || (data.project_id && data.project_id.id === data.oldValue.project_id)
           );
    }

    static asFormGroup(
        timeline: TimelineItem, 
        activitys: ActivityItem[], 
        projets : ProjectItem[],
        comptes : ExpenseAccountItem[],
        users: User[]
    ): FormGroup {
        let activity = activitys.find(elem => elem.id === timeline.activity_id);
        let project = projets.find(elem => elem.id === timeline.project_id);
        let compte = comptes.find(elem => elem.id === timeline.expense_account_id);
        let user = users.find(elem => elem.id === timeline.user_id);

        const fg = new FormGroup(
            {
                id: new FormControl(timeline.id, Validators.required),
                day_of_week: new FormControl(timeline.day_of_week, Validators.required),
                punch_in: new FormControl(timeline.punch_in, Validators.required),
                punch_out: new FormControl(timeline.punch_out, Validators.required),
                activity_id: new FormControl(activity),
                project_id: new FormControl(project),
                expense_account_id: new FormControl(compte, Validators.required),
                user_id: new FormControl(user, Validators.required),
                oldValue: new FormControl(timeline),
                isChanged: new FormControl(timeline.isChanged, Validators.required),
            },  [TimelineItem.IsTimelineFormChanged, TimelineItem.ensurepunchIsInterval]
        );
        return fg;
    }

    static ensurepunchIsInterval: ValidatorFn = (fg: FormGroup) => {
        const punch_in = fg.get('punch_in').value;
        const punch_out = fg.get('punch_out').value;
        let punch_out_field = fg.get('punch_out');
        if(punch_in && punch_out && punch_in > punch_out) {
            fg.get('punch_out').setErrors({ punchFinAvantDebut: true });
        }else if(punch_out_field.hasError("punchFinAvantDebut")) {
            punch_out_field.setErrors({ punchFinAvantDebut: false });
            punch_out_field.updateValueAndValidity();
        }
        return null;
    };

    static IsTimelineFormChanged: ValidatorFn = (fg: FormGroup) => {
        let isDifferent = !TimelineItem.isUnchanged(fg.value);
        let isChangedCtrl = fg.get('isChanged');

        if(!isChangedCtrl.value && isDifferent) {
            isChangedCtrl.setValue(true,  { emitEvent: false });
        }else if(isChangedCtrl.value && !isDifferent) {
            isChangedCtrl.setValue(false,  { emitEvent: false });
        } 
        return null;
    };


    static getValidationMessages() {
        return {
            'punch_in': [
                { type: 'required', message: 'requis' /*'Une heure de début est requise'*/ },
            ],
            'punch_out': [
                { type: 'required', message: 'requis' /*'Une heure de fin est requise'*/ },
                { type: 'punchFinAvantDebut', message: 'punch fin trop petit' },
            ],
            'user_id': [
                { type: 'required', message: 'requis' /*'Un utilisateur est requis'*/ },
            ],
            'expense_account_id': [
                { type: 'required', message: 'requis' /*'Un compte est requis'*/ },
            ],
            'day_of_week' : [
                { type: 'required', message: 'requis'/*'Un jour est requis'*/ },
            ],
        };
    }
}