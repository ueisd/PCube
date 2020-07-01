import { OnInit, Component } from '@angular/core';
import { ProjectItem } from 'src/app/models/project';
import { ProjectService } from 'src/app/services/project/project.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import * as $ from 'jquery/dist/jquery.min.js';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})

export class ProjectListComponent implements OnInit {

  nameFilter = new FormControl('');

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

  onFilterChanged(){
    this.refreshList();
  }

  treeControl = new FlatTreeControl<FlatNode>(
      node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
      this._transformer, node => node.level, node => node.expandable, node => node.child_project);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);


  hasChild = (_: number, node: FlatNode) => node.expandable;

  refreshList(){
    let project = new ProjectItem()
    project.name = this.nameFilter.value.trim();
    this.projectService.filterProject(project).subscribe(projets =>{
      this.dataSource.data = projets;
    });
    
  }
}

/** Flat node with expandable and level information */
interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}