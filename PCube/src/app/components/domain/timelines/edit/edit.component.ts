import { Component, OnInit, Input } from '@angular/core';
import { TimelineItem } from 'src/app/models/timeline';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  @Input() timeline: TimelineItem;

  constructor() { }

  ngOnInit(): void {
  }

}
