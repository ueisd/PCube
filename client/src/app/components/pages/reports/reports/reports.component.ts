import { Component, OnInit } from '@angular/core';
import { RepportRequestService } from 'src/app/services/request/repport-request.service';
import { ReportItem } from 'src/app/models/report-item';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { ReportRequest } from 'src/app/models/report-request';
import { Subscription } from 'rxjs';
import { DataTreeFetcher } from 'src/app/models/utils/DataTreeFetcher';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit {
  reportRequest: ReportRequest;
  reportsItems: ReportItem[];
  reportReqSubscription: Subscription;

  treeControl = new FlatTreeControl<FlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.child
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  private static updateTreeSum(dataTree) {
    for (const rootItem of dataTree) {
      this.updateSum(rootItem);
    }
  }

  private static updateSum(item) {
    item.sumTotal = item.summline;
    for (const child of item.child) {
      item.sumTotal += this.updateSum(child);
    }
    return item.sumTotal;
  }

  private _transformer(node: ReportItem, level: number) {
    const nodeNochild: ReportItem = new ReportItem(node);
    nodeNochild.child = [];
    return {
      expandable: !!node.child && node.child.length > 0,
      name: node.name,
      projectItem: nodeNochild,
      id: node.id,
      parent_id: node.parent_id,
      sommeHeure: node.sumTotal,
      summline: node.summline,
      level,
    };
  }

  heureSommeToStr(somme: number) {
    const mins = somme % 60;
    const heures = (somme - mins) / 60;
    let ret = heures + 'h';
    if (mins < 10) {
      ret += '0';
    }
    ret += mins;
    return ret;
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  constructor(private reportReqService: RepportRequestService) {}

  ngOnInit(): void {
    if (history.state.params) {
      this.reportRequest = history.state.params;
      this.refreshReport();
    }

    this.reportReqSubscription = this.reportReqService.paramsAnnounced$.subscribe((params) => {
      this.reportRequest = params;
      this.refreshReport();
    });
  }

  async refreshReport() {
    const reportsI: ReportItem[] = await this.reportReqService.getReport(this.reportRequest).toPromise();
    const tree = {
      itemList: reportsI,
      fieldsNames: {
        childs: 'child',
        id: 'id',
        parentId: 'parent_id',
      },
    };
    const dataTree = DataTreeFetcher.fetchProjectTree<ReportItem>(tree);
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
