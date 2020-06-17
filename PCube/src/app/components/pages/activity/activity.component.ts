import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivityService } from 'src/app/services/activity/activity.service';
import { ActivityListComponent } from 'src/app/components/domain/activity/activity-list/activity-list.component';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {

  @ViewChild(ActivityListComponent) child;


  constructor(private activityService: ActivityService) { }

  ngOnInit(): void {}

  askForDataRefresh($event){
    this.child.refreshList();
  }

}
