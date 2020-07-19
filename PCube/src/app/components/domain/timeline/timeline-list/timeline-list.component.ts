import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TimelineService } from 'src/app/services/timeline/timeline.service';
import { TimelineItem } from 'src/app/models/timeline';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { DeleteTimelineComponent } from 'src/app/components/domain/timeline/delete-timeline/delete-timeline.component';
import { Router } from '@angular/router';
import { TimelineFilterItem } from 'src/app/models/timelineFilter';
import { CustomSnackBar } from 'src/app/utils/custom-snackbar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-timeline-list',
  templateUrl: './timeline-list.component.html',
  styleUrls: ['./timeline-list.component.css'],
  providers:[
    {provide: DatePipe},
    {provide: MAT_DATE_LOCALE, useValue: 'en-CA'}
  ]
})
export class TimelineListComponent implements OnInit {

  dateFilter;

  constructor(
    private timelineService: TimelineService,
    private dialog: MatDialog,
    private snackBar : MatSnackBar,
    private router: Router,
    private datePipe: DatePipe
  ) { 
    this.dateFilter = this.datePipe.transform(this.dateFilter, 'yyyy-MM-dd');
  }

  memberFilter:FormControl =  new FormControl('');
  expenseFilter:FormControl =  new FormControl('');
  projectFilter:FormControl =  new FormControl('');
  activityFilter:FormControl =  new FormControl('');

  customSnackBar:CustomSnackBar = new CustomSnackBar(this.snackBar)

  dataSource = new MatTableDataSource<TimelineItem>();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.refreshList();
  }



  displayedColumns:string[] = ['jour', 'heures', 'membre', 'projet', 'activiter', 'compteDepense', 'operations'];

  refreshList(){
    let timelineFilter:TimelineFilterItem = new TimelineFilterItem();
    timelineFilter.day_of_week = this.dateFormatISO8601(this.dateFilter);
    timelineFilter.activity_name = this.activityFilter.value;
    timelineFilter.project_name = this.projectFilter.value;
    timelineFilter.member_name = this.memberFilter.value;
    timelineFilter.accounting_time_category_name = this.expenseFilter.value;

    this.timelineService.getTimelineByFilter(timelineFilter).subscribe(timelines => {
      this.dataSource = new MatTableDataSource<TimelineItem>(timelines);
      this.dataSource.paginator = this.paginator;
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
          this.customSnackBar.openSnackBar("La ligne de temps a été supprimé", 'notif-success');
          this.refreshList();
        },
        (error) => {
          this.customSnackBar.openSnackBar('Une erreur s\'est produit. Veuillez réessayer', 'notif-error');
        });
      }
    });
  }

  dateFormatISO8601(date:Date): string{

    if(!date)
      return "";

    let iso = date.toISOString();
    let index = iso.indexOf('T');
    iso = iso.substr(0, index);

    return iso;
  }

  onModifyTimeline(timeline){
    this.router.navigate(['/gestion-des-lignes-de-temps/modifier-ligne-de-temps/' + timeline.id]);
  }

  onFilterChanged(){
    this.refreshList();
  }

  resetDateFilter(){
    let emptyDate:Date;
    this.dateFilter = emptyDate;
    this.refreshList();
  }

}
