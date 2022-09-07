import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { DateFetcher } from './utils/dateFetcher';

import { ActivityItem } from './activity';
import { ExpenseAccountItem } from './expense-account';
import { ProjectItem } from './project';
import { User } from './user';

const format = 'yyyy-MM-dd';
const locale = 'en-US';

export class TimelineItem {

  constructor(timelineResponse?: any) {
    this.id = (timelineResponse && timelineResponse.id) || 0;
    this.day_of_week = (timelineResponse && timelineResponse.day_of_week) || '';
    this.punch_in = (timelineResponse && timelineResponse.punch_in) || '';
    this.punch_out = (timelineResponse && timelineResponse.punch_out) || '';
    this.project_id = (timelineResponse && timelineResponse.project_id) || '';
    this.expense_account_id = (timelineResponse && timelineResponse.expense_account_id) || '';
    this.activity_id = (timelineResponse && timelineResponse.activity_id) || '';
    this.user_id = (timelineResponse && timelineResponse.user_id) || '';
    if (timelineResponse && timelineResponse.isChanged) { this.isChanged = timelineResponse.isChanged; }
    if (timelineResponse && timelineResponse.isDelete) { this.isDelete = timelineResponse.isDelete; }
  }
  id = 0;
  day_of_week: string;
  punch_in: string;
  punch_out: string;
  project_id: number;
  expense_account_id: number;
  activity_id: number;
  user_id: number;
  isChanged = false;
  isDelete = false;

  static fetchTimelineFromResponse(item) {
    const a = DateFetcher.fetchMomentFromTimestampStr(item.punchIn, 'America/New_York');
    const b = DateFetcher.fetchMomentFromTimestampStr(item.punchOut, 'America/New_York');

    item.day_of_week = DateFetcher.fetchDayString(a);
    item.punch_in = DateFetcher.fetchHHMMStr(a);
    item.punch_out = DateFetcher.fetchHHMMStr(b);
    item.project_id = item.ProjectId;
    item.expense_account_id = item.ExpenseAccountId;
    item.user_id = item.UserId;
    item.activity_id = item.ActivityId;
    return new TimelineItem(item);
  }

  static builFromFormGroup(item: any): TimelineItem {
    const buildedItem = new TimelineItem(item);
    if (item.id) { buildedItem.id = item.id; }
    if (item.project_id) { buildedItem.project_id = item.project_id.id; }
    if (item.activity_id) { buildedItem.activity_id = item.activity_id.id; }
    if (item.user_id) { buildedItem.user_id = item.user_id.id; }
    if (item.expense_account_id) { buildedItem.expense_account_id = item.expense_account_id.id; }
    buildedItem.day_of_week = formatDate(item.day_of_week, format, locale);
    return buildedItem;
  }

  static isUnchanged(data: any) {
    const older = data.oldValue;
    const current = data;
    return (
      formatDate(current.day_of_week, format, locale) === older.day_of_week &&
      current.punch_in === older.punch_in &&
      current.punch_out === older.punch_out &&
      ((current.activity_id == null && older.activity_id == '') || (current.activity_id && current.activity_id.id === older.activity_id)) &&
      ((current.expense_account_id == null && older.expense_account_id == '') || (current.expense_account_id && current.expense_account_id.id === older.expense_account_id)) &&
      ((current.user_id == null && older.user_id == '') || (current.user_id && current.user_id.id === older.user_id)) &&
      ((current.project_id == null && older.project_id == '') || (current.project_id && current.project_id.id === older.project_id))
    );
  }

  static asFormGroup(timeline: TimelineItem, activitys: ActivityItem[], projets: ProjectItem[], comptes: ExpenseAccountItem[], users: User[]): FormGroup {
    const activity = activitys.find((elem) => elem.id === timeline.activity_id);
    const project = projets.find((elem) => elem.id === timeline.project_id);
    const compte = comptes.find((elem) => elem.id === timeline.expense_account_id);
    const user = users.find((elem) => elem.id === timeline.user_id);

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
        isDelete: new FormControl(timeline.isDelete, Validators.required),
      },
      [TimelineItem.IsTimelineFormChanged, TimelineItem.ensurepunchIsInterval]
    );
    return fg;
  }

  static ensurepunchIsInterval: ValidatorFn = (fg: FormGroup) => {
    const punch_in = fg.get('punch_in').value;
    const punch_out = fg.get('punch_out').value;
    const punch_out_field = fg.get('punch_out');
    if (punch_in && punch_out && punch_in > punch_out) {
      fg.get('punch_out').setErrors({ punchFinAvantDebut: true });
    } else if (punch_out_field.hasError('punchFinAvantDebut')) {
      punch_out_field.setErrors({ punchFinAvantDebut: false });
      punch_out_field.updateValueAndValidity();
    }
    return null;
  }

  static IsTimelineFormChanged: ValidatorFn = (fg: FormGroup) => {
    const isDifferent = !TimelineItem.isUnchanged(fg.value);
    const isChangedCtrl = fg.get('isChanged');

    if (!isChangedCtrl.value && isDifferent) {
      isChangedCtrl.setValue(true, { emitEvent: false });
    } else if (isChangedCtrl.value && !isDifferent) {
      isChangedCtrl.setValue(false, { emitEvent: false });
    }
    return null;
  }

  static getValidationMessages() {
    return {
      punch_in: [{ type: 'required', message: 'requis' /*'Une heure de début est requise'*/ }],
      punch_out: [
        { type: 'required', message: 'requis' /*'Une heure de fin est requise'*/ },
        { type: 'punchFinAvantDebut', message: 'punch fin trop petit' },
      ],
      user_id: [{ type: 'required', message: 'requis' /*'Un utilisateur est requis'*/ }],
      expense_account_id: [{ type: 'required', message: 'requis' /*'Un compte est requis'*/ }],
      day_of_week: [{ type: 'required', message: 'requis' /*'Un jour est requis'*/ }],
    };
  }

  builApiEntry(): any {
    const item: any = {};
    if (this.id) { item.id = this.id; }
    if (this.project_id) { item.ProjectId = this.project_id; }
    if (this.expense_account_id) { item.ExpenseAccountId = this.expense_account_id; }
    if (this.user_id) { item.UserId = this.user_id; }
    if (this.activity_id) { item.ActivityId = this.activity_id; }
    const days = this.day_of_week;
    item.punchIn = DateFetcher.fetchUnixNbr(days, this.punch_in, 'America/New_York');
    item.punchOut = DateFetcher.fetchUnixNbr(days, this.punch_out, 'America/New_York');
    return item;
  }
}
