import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TimelineService } from 'src/app/services/timeline/timeline.service';
import { TimelineItem } from 'src/app/models/timeline';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteTimelineComponent } from 'src/app/components/domain/timeline/delete-timeline/delete-timeline.component';

@Component({
  selector: 'app-timeline-list',
  templateUrl: './timeline-list.component.html',
  styleUrls: ['./timeline-list.component.css']
})
export class TimelineListComponent implements OnInit {

  constructor(
    private timelineService: TimelineService,
    private dialog: MatDialog,
    private snackBar : MatSnackBar
  ) { }


  ngOnInit(): void {
    this.refreshList();
  }

  dataSource:TimelineItem[] = [];

  displayedColumns:string[] = ['jour', 'heures', 'membre', 'projet', 'activiter', 'compteDepense', 'operations'];;

  refreshList(){
    let timeline = new TimelineItem();

    this.timelineService.getTimelineByFilter(timeline).subscribe(timelines => {
      this.dataSource = timelines;
      console.log(timelines);
    });
  }

  onDeleteTimeline(timeline:any){
    
    const dialogRef = this.dialog.open(DeleteTimelineComponent, {
      data: { 
        id: timeline.id, 
        firstName: timeline.first_name, 
        lastName: timeline.last_name, 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined) {
        this.timelineService.deleteTimeline(timeline.id, timeline.day_of_week, timeline.punch_in, timeline.punch_out).subscribe((data) => {
          this.openSnackBar("La ligne de temps a été supprimé", 'notif-success');
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
      duration: 10000,
      horizontalPosition: "right",
      verticalPosition: "bottom",
      panelClass: [panelClass]
    });
  }


}
