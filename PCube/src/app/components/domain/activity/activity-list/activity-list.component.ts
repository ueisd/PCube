import { Component, OnInit, Input } from '@angular/core';
import { ActivityItem } from 'src/app/components/domain/activity/activity-item/activity';
import { ActivityService } from 'src/app/services/activity/activity.service';
import * as $ from 'jquery/dist/jquery.min.js';
import { disableDebugTools } from '@angular/platform-browser';

const HIDDEN_CLASS = 'hidden';

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
  
  changeAcceptModificationButtonState(buttonId, desactivate){
    $("#accept-"+buttonId).attr("disabled", desactivate);
  }
  
  bindKeypress(){
    $( document ).ready(function() {
      this.dataSource.forEach(element => {
        $("#input-"+element.id).bind('keyup', function(e){

          let newName = $("#"+e.target.id).val().trim();
          let dashIndex = e.target.id.indexOf('-');
          let id = e.target.id.substring(dashIndex + 1);

          console.log(newName);

          if(newName.length == 0){
            this.changeAcceptModificationButtonState(id, true);
            return;
          }

          this.activityService.isNameUnique(newName).subscribe(isUnique => {
            if(isUnique){
              this.changeAcceptModificationButtonState(id, false);
            }else{
              this.changeAcceptModificationButtonState(id, true);
            }
          });

        }.bind(this));
      });
    }.bind(this));
  }

  refreshList(){
    this.displayedColumns = ['name', 'operations'];
    this.activityService.getAllActivity().subscribe(activities => {
      this.dataSource = activities;
      this.bindKeypress();
    })
  }

  editAction(activity){
    $("#modification-"+activity.id).removeClass(HIDDEN_CLASS);
    $("#showName-"+activity.id).addClass(HIDDEN_CLASS);
  }

  acceptModification(activity){
    let newName = $("#input-"+activity.id).val();
    console.log("new name : " + newName);
  }

  cancelModification(activity){
    $("#modification-"+activity.id).addClass(HIDDEN_CLASS);
    $("#showName-"+activity.id).removeClass(HIDDEN_CLASS);
    $("#input-"+activity.id).val(activity.name);
    this.changeAcceptModificationButtonState(activity.id, true);
  }

}
