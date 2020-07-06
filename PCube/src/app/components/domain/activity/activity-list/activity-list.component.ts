import { Component, OnInit } from '@angular/core';
import { ActivityItem } from 'src/app/models/activity';
import { MatDialog } from "@angular/material/dialog";
import { ActivityService } from 'src/app/services/activity/activity.service';
import * as $ from 'jquery/dist/jquery.min.js';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { Observable, } from 'rxjs';
import { DeleteActivityComponent } from '../delete-activity/delete-activity.component';

const HIDDEN_CLASS = 'hidden';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.css']
})

export class ActivityListComponent implements OnInit {

  nameFilter = new FormControl('');

  constructor(private activityService: ActivityService, 
    private dialog: MatDialog, 
    private snackBar : MatSnackBar ) { }

  displayedColumns : string[];
  dataSource: ActivityItem[];

  ngOnInit(): void {
    this.refreshList();
  }
  
  changeAcceptModificationButtonState(buttonId, desactivate: boolean){
    $("#accept-"+buttonId).attr("disabled", desactivate);
  }

  changeNotUniqueMessageState(id, isHidden: boolean){
    if(isHidden)
      $("#error-"+id).addClass('hidden');
    else
    $("#error-"+id).removeClass('hidden');
  }

  onNameFilterChanged(){
    this.refreshList();
  }

  bindKeypress(){
    $( document ).ready(function() {
      this.dataSource.forEach(element => {
        $("#input-"+element.id).bind('keyup', function(e){

          let newName = $("#"+e.target.id).val().trim();
          let dashIndex = e.target.id.indexOf('-');
          let id = e.target.id.substring(dashIndex + 1);

          if(!this.isNewValueValid(newName)){
            this.changeAcceptModificationButtonState(id, true);
            this.changeNotUniqueMessageState(id, false);
            return;
          }

          this.activityService.isNameUnique(newName).subscribe(isUnique => {
            if(isUnique){
              this.changeAcceptModificationButtonState(id, false);
              this.changeNotUniqueMessageState(id, true);
            }else{
              this.changeAcceptModificationButtonState(id, true);
              this.changeNotUniqueMessageState(id, false);
            }
          });

        }.bind(this));
      });
    }.bind(this));
  }

  openDeleteDialog(activity) {
    const dialogRef = this.dialog.open(DeleteActivityComponent, {
      data: {
        id: activity.id,
        name: activity.name,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined) {
        this.activityService.deleteActivity(result.id).subscribe((data) => {
          this.openSnackBar('L\'activité a été supprimé!', 'notif-success');
          this.refreshList();
        },
        (error) => {
          this.openSnackBar('Une erreur s\'est produit. Veuillez réessayer', 'notif-error');
        });
      }
    });
  }

  openSnackBar(message, panelClass) {
    this.snackBar.open(message, 'Fermer', {
      duration: 2000,
      horizontalPosition: "right",
      verticalPosition: "bottom",
      panelClass: [panelClass]
    });
  }

  refreshList(){
    let activity = new ActivityItem();
    activity.name = this.nameFilter.value.trim();
    this.displayedColumns = ['name', 'operations'];
    this.activityService.filterActivity(activity).subscribe(activities => {
      this.dataSource = activities;
      this.bindKeypress();
    });
  }

  editAction(activity){
    $("#modification-"+activity.id).removeClass(HIDDEN_CLASS);
    $("#showName-"+activity.id).addClass(HIDDEN_CLASS);
  }

  isNewValueValid(newValue): boolean{
    if(newValue == null || newValue.trim().length == 0)
      return false;
    else
      return true;
  }

  acceptModification(activity){
    let newName = $("#input-"+activity.id).val();

    if(!this.isNewValueValid(newName))
      return;

    this.activityService.isNameUnique(newName).subscribe(isUnique => {
      if(isUnique){
        this.activityService.updateActivity(activity.id, activity.name, newName).subscribe(isUpdated => {
          this.refreshList();
        });
      }
    });
  }

  cancelModification(activity){
    $("#modification-"+activity.id).addClass(HIDDEN_CLASS);
    $("#showName-"+activity.id).removeClass(HIDDEN_CLASS);
    $("#input-"+activity.id).val(activity.name);
    this.changeAcceptModificationButtonState(activity.id, true);
  }

}
