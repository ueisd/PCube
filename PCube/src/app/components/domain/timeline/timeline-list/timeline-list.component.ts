import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TimelineService } from 'src/app/services/timeline/timeline.service';
import { TimelineItem } from 'src/app/models/timeline';

@Component({
  selector: 'app-timeline-list',
  templateUrl: './timeline-list.component.html',
  styleUrls: ['./timeline-list.component.css']
})
export class TimelineListComponent implements OnInit {

  constructor(
    private timelineService: TimelineService
  ) { }


  ngOnInit(): void {
    this.refreshList();
  }

  dataSource:TimelineItem[] = [];

  displayedColumns:string[] = ['jour', 'entree', 'sortie'];;

  refreshList(){
    let timeline = new TimelineItem();

    this.timelineService.getTimelineByFilter(timeline).subscribe(timelines => {
      this.dataSource = timelines;
      console.log(timelines);
    });
  }

}
