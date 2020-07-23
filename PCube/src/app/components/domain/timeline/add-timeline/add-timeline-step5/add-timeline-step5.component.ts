import { Component, OnInit, NgModule, ViewChild, Output, EventEmitter } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/models/format-datepicker';
import { DatePipe } from '@angular/common';
import { WorkingShift } from 'src/app/models/working-shift';
import { Shift } from 'src/app/models/shift';
import { TimelineService } from 'src/app/services/timeline/timeline.service';

const NORMAL_CLASS = "alert-primary";
const SUCCESS_CLASS = "alert-success";
const WARNING_CLASS = "alert-warning";
const DANGER_CLASS = "alert-danger";

const FOCUSED_CLASS = "on-focus";
const NOT_FOCUSED_CLASS = "not-on-focus";

const NORMAL_MESSAGE = "Veuillez saisir les heures travaillées";

const TIME_PATTERN = "([1-2][0-9]|[0-9]):[0-5][0-9]";

@Component({
  selector: 'app-add-timeline-step5',
  templateUrl: './add-timeline-step5.component.html',
  styleUrls: ['../add-timeline.component.css', './add-timeline-step5.component.css'],
  providers: [
    { provide: DatePipe },
    { provide: MAT_DATE_LOCALE, useValue: 'en-CA' }
  ]
})


export class AddTimelineStep5Component implements OnInit {

  @Output() isFormValidEvent = new EventEmitter<boolean>();
  @Output() ouputWorkingShift = new EventEmitter<WorkingShift[]>();
  @Output() askingForWorkingShiftValidation = new EventEmitter<boolean>();

  constructor(
    private datePipe: DatePipe,
    private timelineService: TimelineService
  ) { }

  message: string = NORMAL_MESSAGE;
  messageClasse: string = NORMAL_CLASS;

  canAddMoreHours: boolean = true;

  buttonId: number = -1;
  removeLastTimelineHover: number = -1;

  ngOnInit(): void {
    this.placeDefaultWorkingTimeline();
  }

  workingTimelines: WorkingShift[] = [];

  placeDefaultWorkingTimeline() {
    let workgingShift: WorkingShift = new WorkingShift(null);
    let shift: Shift = new Shift("8:00", "12:00");
    workgingShift.addShift(shift);
    this.workingTimelines.push(workgingShift);
  }

  addTimeline() {
    let shift: Shift = new Shift("8:00", "12:00");
    let workgingShift: WorkingShift = new WorkingShift(null);
    workgingShift.shift.push(shift);
    this.workingTimelines.push(workgingShift);
    this.onAddOrRemoveRow();
  }

  removeTimeline() {
    let lastIndex = this.workingTimelines.length - 1;
    this.workingTimelines.splice(lastIndex, 1);
    this.onAddOrRemoveRow();

    if (lastIndex == 1)
      this.removeLastTimelineHover = -1;

  }

  addShift(workingShiftIndex) {
    let shift: Shift = new Shift("8:00", "12:00");
    this.workingTimelines[workingShiftIndex].addShift(shift);
    this.onAddOrRemoveRow();
  }

  removeShift(workingShiftIndex) {

    let lastIndex = this.workingTimelines[workingShiftIndex].shift.length - 1;
    this.workingTimelines[workingShiftIndex].shift.splice(lastIndex, 1);
    this.onAddOrRemoveRow();

    if (workingShiftIndex == 0)
      this.buttonId = -1;
  }

  showPannelMessage(message: string, cssClass: string) {
    this.message = message;
    this.messageClasse = cssClass;
  }

  onErrorFoundFromConfirmation(msg: string) {
    this.showPannelMessage(msg, DANGER_CLASS);
  }

  onErrorWarning(msg: string) {
    this.showPannelMessage(msg, WARNING_CLASS);
  }

  onConfirmationSuccess() {
    this.showPannelMessage("Les heures sont valides.", SUCCESS_CLASS);
  }

  onAddOrRemoveRow() {
    this.showPannelMessage("Veuillez saisir les heures travaillées", WARNING_CLASS);
    this.callOuputEvent(false)
  }

  onFormSubmitSuccess() {
    this.showPannelMessage("Vous pouvez réutiliser les heures saisies.", WARNING_CLASS);
    this.callOuputEvent(false)
  }

  isDateValid(date: Date): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }

  convertHoursStringToInt(hours: string): number {
    let temps: string = hours;
    temps = temps.replace(':', '');
    return parseInt(temps);
  }

  areShiftsValid(shift: Shift[]): boolean {

    let isValid: boolean = true;

    for (let i = 0; i < shift.length && isValid; ++i) {

      let begin = shift[i].begin;
      let end = shift[i].end;

      isValid = begin.match(TIME_PATTERN) != null && end.match(TIME_PATTERN) != null;

      let intBegin1 = this.convertHoursStringToInt(begin);
      let intEnd1 = this.convertHoursStringToInt(end);

      isValid = (intBegin1 == intEnd1) ? false: true;

      for (let j = i + 1; j < shift.length && isValid; ++j) {

        let intBegin2 = this.convertHoursStringToInt(shift[j].begin);
        let intEnd2 = this.convertHoursStringToInt(shift[j].end);

        if (
          (intBegin2 >= intBegin1 && intBegin2 <= intEnd1) ||
          (intEnd2 >= intBegin1 && intEnd2 <= intEnd1) ||
          (intBegin1 >= intBegin2 && intBegin1 <= intEnd2) ||
          (intEnd1 >= intBegin2 && intEnd1 <= intEnd2)
        ){
          isValid = false;
        }
        
      }
    }

    return isValid;
  }

  callOuputEvent(isSuccess) {
    this.isFormValidEvent.emit(isSuccess);
    this.ouputWorkingShift.emit(this.workingTimelines);
  }

  formatDateForErrorMessage(date: Date): string {
    return (date.getMonth() + 1).toString() + "/" + date.getDate() + "/" + date.getFullYear();
  }

  datePickerValueChanged() {
    this.callOuputEvent(false)
    this.onErrorWarning("Veuillez valider les modifications");
  }

  validateAllTimeLine() {

    let isValid: boolean = true;

    for (let i = 0; i < this.workingTimelines.length && isValid; ++i) {

      let date = this.workingTimelines[i].date;

      if (!this.isDateValid(date)) {
        isValid = false;
        this.onErrorFoundFromConfirmation("Une date est manquante");
      }

      for (let j = i + 1; j < this.workingTimelines.length && isValid; ++j) {

        if (!this.isDateValid(this.workingTimelines[j].date)) {
          isValid = false;
          this.onErrorFoundFromConfirmation("Une date est manquante");
        }

        if (isValid && date.getTime() == this.workingTimelines[j].date.getTime()) {
          isValid = false;
          this.onErrorFoundFromConfirmation("Duplication de plage horaire : " + this.formatDateForErrorMessage(date));
        }
      }

      if (isValid && !this.areShiftsValid(this.workingTimelines[i].shift)) {
        isValid = false;
        this.onErrorFoundFromConfirmation("Conflit d'heure pour : " + this.formatDateForErrorMessage(date));
      }
    }

    if (!isValid) {
      this.callOuputEvent(isValid)
      return;
    }

    this.ouputWorkingShift.emit(this.workingTimelines);
    this.askingForWorkingShiftValidation.emit(true);
  }


  awaitingWorkingShiftValidation(isValid: boolean, msg?: string) {
    if (isValid)
      this.onConfirmationSuccess();
    else
      this.onErrorFoundFromConfirmation(msg);

    this.callOuputEvent(isValid)
  }

  setGeneratedValue(workgingShift: WorkingShift, canAddMoreHours: boolean) {
    this.canAddMoreHours = canAddMoreHours;
    this.workingTimelines[0].shift[0].begin = workgingShift.shift[0].begin;
    this.workingTimelines[0].shift[0].end = workgingShift.shift[0].end;

    let date: Date = new Date(workgingShift.date.getDate());
    this.workingTimelines[0].date = workgingShift.date;
  }
}
