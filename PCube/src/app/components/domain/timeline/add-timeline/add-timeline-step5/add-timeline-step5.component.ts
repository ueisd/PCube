import { Component, OnInit, NgModule, ViewChild, Output, EventEmitter } from '@angular/core';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/models/format-datepicker';
import { DatePipe } from '@angular/common';
import { WorkingShift } from 'src/app/models/working-shift';
import { Shift } from 'src/app/models/shift';

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
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS},
    {provide: DatePipe},
    {provide: MAT_DATE_LOCALE, useValue: 'en-CA'}
  ]
})


export class AddTimelineStep5Component implements OnInit {

  @Output() isFormValidEvent = new EventEmitter<boolean>();
  @Output() ouputWorkingShift = new EventEmitter<WorkingShift[]>();

  constructor () {}

  message:string = NORMAL_MESSAGE;
  messageClasse:string = NORMAL_CLASS;

  ngOnInit(): void {

    this.placeDefaultWorkingTimeline();
  }

  workingTimelines:WorkingShift[] = [];

  placeDefaultWorkingTimeline(){
    let workgingShift:WorkingShift = new WorkingShift(null);
    let shift:Shift = new Shift("8:00", "12:00");
    workgingShift.addShift(shift);
    this.workingTimelines.push(workgingShift);
  }

  addTimeline(){
    let shift:Shift = new Shift("8:00", "12:00");
    let workgingShift:WorkingShift = new WorkingShift(null);
    workgingShift.shift.push(shift);
    this.workingTimelines.push(workgingShift);
    this.onAddOrRemoveRow();
  }

  removeTimeline(){
    let lastIndex = this.workingTimelines.length - 1;
    this.workingTimelines.splice(lastIndex, 1);
    this.onAddOrRemoveRow();
  }

  addShift(workingShiftIndex){
    let shift:Shift = new Shift("8:00", "12:00");
    this.workingTimelines[workingShiftIndex].addShift(shift);
    this.onAddOrRemoveRow();
  }

  removeShift(workingShiftIndex){
    let lastIndex = this.workingTimelines[workingShiftIndex].shift.length-1;
    this.workingTimelines[workingShiftIndex].shift.splice(lastIndex, 1);
    this.onAddOrRemoveRow();
  }

  onErrorFoundFromConfirmation(){
    this.message = "Veuillez corriger les erreurs."
    this.messageClasse = WARNING_CLASS;
  }

  onConfirmationSuccess(){
    this.message = "Les heures sont valides.";
    this.messageClasse = SUCCESS_CLASS;
  }

  onAddOrRemoveRow(){
    this.message = "Veuillez saisir les heures travaillées";
    this.messageClasse = WARNING_CLASS;
    this.callOuputEvent(false)
  }

  onFormSubmitSuccess(){
    this.message = "Vous pouvez réutiliser les heures saisies.";
    this.messageClasse = WARNING_CLASS;
    this.callOuputEvent(false)
  }

  isDateValid(date:Date):boolean{
    return date instanceof Date && !isNaN(date.getTime());
  }

  areShiftsValid(shift:Shift[]):boolean{

    let isValid:boolean = true;

    for(let i = 0; i < shift.length && isValid; ++i){

      let begin = shift[i].begin;
      let end = shift[i].end;

      isValid = begin.match(TIME_PATTERN) != null && end.match(TIME_PATTERN) != null ;
    }

    return isValid;
  }

  callOuputEvent(isSuccess){
    this.isFormValidEvent.emit(isSuccess);
    this.ouputWorkingShift.emit(this.workingTimelines);
  }

  validateAllTimeLine(){
    
    let isValid:boolean = true;

    for(let i = 0; i < this.workingTimelines.length && isValid; ++i){
      let date = this.workingTimelines[i].date;
      let shift = this.workingTimelines[i].shift;
      isValid = this.isDateValid(date) && this.areShiftsValid(shift);
    }

    if(isValid)
      this.onConfirmationSuccess();
    else
      this.onErrorFoundFromConfirmation();

    this.callOuputEvent(isValid)
  }
}
