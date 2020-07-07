import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TimelineService } from 'src/app/services/timeline/timeline.service';
import { TimelineItem } from 'src/app/models/timeline';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteTimelineComponent } from 'src/app/components/domain/timeline/delete-timeline/delete-timeline.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-timeline-list',
  templateUrl: './timeline-list.component.html',
  styleUrls: ['./timeline-list.component.css']
})
export class TimelineListComponent implements OnInit {

  constructor(
    private timelineService: TimelineService,
    private dialog: MatDialog,
    private snackBar : MatSnackBar,
    private router: Router
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
    });
  }

  onDeleteTimeline(timeline:any){
    const dialogRef = this.dialog.open(DeleteTimelineComponent, {
      data: { 
        activity_name: timeline.activity_name,
        day_of_week: timeline.day_of_week,
        expense_name: timeline.expense_name, 
        first_name: timeline.first_name,
        last_name: timeline.last_name,
        project_name: timeline.project_name,
        punch_in: timeline.punch_in,
        punch_out: timeline.punch_out,
      },
      panelClass: 'warning-dialog'
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

  onModifyTimeline(timeline){
    this.router.navigate(['/modifier-ligne-de-temps/' + timeline.id]);
  }


}
