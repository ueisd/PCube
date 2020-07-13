import { Component, OnInit } from '@angular/core';
import { RepportRequestService } from 'src/app/services/request/repport-request.service';
import { ReportRequest } from 'src/app/models/report-request';
import { ReportItem } from 'src/app/models/report-item';
import { Router } from '@angular/router';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  reportRequest : ReportRequest;
  reportsItems: ReportItem[];

  private _transformer = (node: ReportItem, level: number) => {
    let nodeNochild: ReportItem = new ReportItem(node);
    nodeNochild.child = [];
    return {
      expandable: !!node.child && node.child.length > 0,
      name: node.name,
      projectItem : nodeNochild,
      id: node.id,
      parent_id: node.parent_id,
      sommeHeure: node.sumTotal,
      summline: node.summline,
      level: level,
    };
  }

  heureSommeToStr(somme :number) {
    let mins = somme % 60;
    let heures = (somme - mins) / 60;
    let ret = heures + "h";
    if(mins < 10)
      ret += "0";
    ret += mins;
    return ret;
  }

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
      this._transformer, node => node.level, node => node.expandable, node => node.child);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: FlatNode) => node.expandable;

  constructor(private reportReqService: RepportRequestService) {

  }

  ngOnInit(): void {
    this.reportRequest = history.state.params;
    this.refreshReport();
    this.reportReqService.paramsAnnounced$.subscribe()

    this.reportReqService.paramsAnnounced$.subscribe(
      params => {
        this.reportRequest = params;
        this.refreshReport();
      }
    );

    
  }

  refreshReport() {
    this.reportReqService.getReport(this.reportRequest).subscribe(reportsI =>{
      this.dataSource.data = reportsI;
      this.reportsItems = reportsI;
      this.treeControl.expandAll();
    });
  }

}


/** Flat node with expandable and level information */
interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}
