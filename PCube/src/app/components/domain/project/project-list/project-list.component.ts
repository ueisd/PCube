import { OnInit, Component, ViewChild, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { ProjectItem } from 'src/app/components/domain/project/project-item/project';
import { ProjectService } from 'src/app/services/project/project.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import * as $ from 'jquery/dist/jquery.min.js';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})

export class ProjectListComponent implements OnInit {

  @ViewChild('outerSort', { static: true }) sort: MatSort;
  @ViewChildren('innerSort') innerSort: QueryList<MatSort>;
  @ViewChildren('innerTables') innerTables: QueryList<MatTable<TestProject>>;

  constructor(private projectService: ProjectService, private cd: ChangeDetectorRef ) { }

  dataSource: MatTableDataSource<TestProject>;
  projectData: TestProject[] = [];
  columnsToDisplay = ['id', 'name', 'parent_id'];
  innerDisplayedColumns = ['id', 'name', 'parent_id'];
  expandedElement: TestProject | null;

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList(){

    USERS.forEach(user => {
      if (user.child_project && Array.isArray(user.child_project) && user.child_project.length) {
        this.projectData = [...this.projectData, {...user, child_project: new MatTableDataSource(user.child_project)}];
      } else {
        this.projectData = [...this.projectData, user];
      }
    });
    this.dataSource = new MatTableDataSource(this.projectData);
    this.dataSource.sort = this.sort;
  




    this.projectService.getAllProject().subscribe(projects => {
      
      projects.forEach(project => {
        //this.projectData = [...this.projectData, {...project, child_project: new MatTableDataSource(project.child_project)}]
      });

      //this.dataSource = new MatTableDataSource(this.usersData);
      //this.dataSource.sort = this.sort;

    });
  }


  toggleRow(element: TestProject) {
    element.child_project && (element.child_project as MatTableDataSource<TestProject>).data.length ? (this.expandedElement = this.expandedElement === element ? null : element) : null;
    this.cd.detectChanges();
    this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<TestProject>).sort = this.innerSort.toArray()[index]);
  }


}

export interface TestProject {
  id : number;
  name : string;
  parent_id: number;
  child_project?: TestProject[] | MatTableDataSource<TestProject>;
}

const USERS: TestProject[] = [
  {
    id: 1,
    name: "mason@test.com",
    parent_id: 1,
    child_project: [
      {
        id: 40,
        name: "mason@test.com",
        parent_id: 1,
      },
      {
        id: 41,
        name: "mason@test.com",
        parent_id: 1,
      }
    ]
  },
  {
    id: 2,
    name: "mason@test.com",
    parent_id: 2,
  },
  {
    id: 3,
    name: "mason@test.com",
    parent_id: 3,
    child_project: [
      {
        id: 42,
        name: "mason@test.com",
        parent_id: 3,
      },
      {
        id: 43,
        name: "mason@test.com",
        parent_id: 3,
      }
    ]
  }
];