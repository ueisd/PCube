import { Component, OnInit } from '@angular/core';

const NORMAL_CLASS = "alert-primary";
const SUCCESS_CLASS = "alert-success";
const WARNING_CLASS = "alert-warning";
const DANGER_CLASS = "alert-danger";

const FOCUSED_CLASS = "on-focus";
const NOT_FOCUSED_CLASS = "not-on-focus";

const NORMAL_MESSAGE = "Veuillez saisir un compte";

@Component({
  selector: 'app-add-timeline-step5',
  templateUrl: './add-timeline-step5.component.html',
  styleUrls: ['../add-timeline.component.css']
})
export class AddTimelineStep5Component implements OnInit {

  constructor() { }

  message:string = NORMAL_MESSAGE;
  messageClasse:string = NORMAL_CLASS;

 

  ngOnInit(): void {
  }

}
