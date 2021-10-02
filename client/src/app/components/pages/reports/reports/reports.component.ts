import { Component, OnInit } from '@angular/core';
import { RepportRequestService } from 'src/app/services/request/repport-request.service';
import { ReportItem } from 'src/app/models/report-item';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { ReportRequest } from 'src/app/models/report-request';
import { ReportRequestForBackend } from 'src/app/models/report-reques-backend';
import { Subscription } from 'rxjs';
import { DataTreeFetcher } from 'src/app/models/utils/DataTreeFetcher';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  reportRequest : ReportRequest;
  reportRequestBackend : ReportRequestForBackend;
  reportsItems: ReportItem[];
  reportReqSubscription: Subscription;

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
    if(history.state.params) {
      this.reportRequest = history.state.params;
      this.reportRequestBackend = ReportRequestForBackend.buildFromReportRequest(history.state.params);
      this.refreshReport();
    }

    this.reportReqSubscription = this.reportReqService.paramsAnnounced$.subscribe(
      params => {
        this.reportRequest = params;
        this.reportRequestBackend = ReportRequestForBackend.buildFromReportRequest(params);
        this.refreshReport();
      }
    ); 
  }

  private static updateTreeSum (dataTree) {
    for(let rootItem of dataTree)
      this.updateSum(rootItem)
  }

  private static updateSum(item) {
    item.sumTotal = item.summline;
    for(let child of item.child)
      item.sumTotal += this.updateSum(child);
    return item.sumTotal;
  }

  async refreshReport() {
    let reportsI: ReportItem[] = await this.reportReqService.getReport(this.reportRequestBackend).toPromise();
    let tree = {
      itemList: reportsI,
      fieldsNames: {
          childs: 'child',
          id: 'id',
          parentId: 'parent_id'
      },
    }
    let dataTree = DataTreeFetcher.fetchProjectTree<ReportItem>(tree);
    ReportsComponent.updateTreeSum(dataTree);
    this.dataSource.data = dataTree;
    this.reportsItems = dataTree;
    this.treeControl.expandAll();
  }

  ngOnDestroy() {
    this.reportReqSubscription.unsubscribe();
  }

}


/** Flat node with expandable and level information */
interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}
