import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModifyTimelineComponent } from 'src/app/components/domain/timeline/modify-timeline/modify-timeline.component';
import {Router} from "@angular/router"

@Component({
  selector: 'app-modifying-timeline',
  templateUrl: './modifying-timeline.component.html',
  styleUrls: ['./modifying-timeline.component.css']
})
export class ModifyingTimelineComponent implements OnInit {

  @ViewChild('modifyTimeline') modifyTimeline:ModifyTimelineComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router
    ) { }

  numbers = new RegExp(/^[0-9]+$/);

  isParamValid(id:string): boolean{
    if(id.match(this.numbers))
      return true;
    else
      return false;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void{
    this.route.params.subscribe(params => {
      
      if(this.isParamValid(params.id))
        this.modifyTimeline.setTimelineId(params.id);
      else
        this.router.navigate(['/gerer-ligne-de-temps']);
    });
  }

}
