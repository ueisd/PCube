import { OnInit, Component } from '@angular/core';
import { ProjectItem } from 'src/app/models/project';
import { ProjectService } from 'src/app/services/project/project.service';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import * as $ from 'jquery/dist/jquery.min.js';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})

export class ProjectListComponent implements OnInit {

  constructor(private projectService: ProjectService ) {
    this.refreshList();
  }

  ngOnInit(): void {
    this.refreshList();
  }

  private _transformer = (node: ProjectItem, level: number) => {
    return {
      expandable: !!node.child_project && node.child_project.length > 0,
      name: node.name,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
      node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
      this._transformer, node => node.level, node => node.expandable, node => node.child_project);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);


  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  refreshList(){
    this.projectService.getAllProject().subscribe(projets =>{
      this.dataSource.data = projets;
    });
    
  }
}

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: ProjectItem[] = [
  {
    id: 1,
    name: "allo",
    parent_id: 1,
    child_project:[
      { id: 2,
        name: "allo",
        parent_id: 1,
      }
    ]
  },
  {
    id: 1,
    name: "allo",
    parent_id: 1
  }
];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}