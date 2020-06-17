import { Component, OnInit, Input } from '@angular/core';
import { ActivityItem } from 'src/app/components/domain/activity/activity-item/activity';
import { ActivityService } from 'src/app/services/activity/activity.service';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.css']
})
export class ActivityListComponent implements OnInit {

  constructor(private activityService: ActivityService ) { }

  displayedColumns : string[];
  dataSource: ActivityItem[];

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList(){
    this.displayedColumns = ['name'];
    this.activityService.getAllActivity().subscribe(activities => this.dataSource = activities);
  }

}
