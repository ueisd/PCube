import { OnInit, Component } from '@angular/core';
import { ProjectItem } from 'src/app/models/project';
import { ProjectService } from 'src/app/services/project/project.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { AddProjectComponent } from '../add-project/add-project.component';
import { DeleteProjectComponent } from 'src/app/components/domain/project/delete-project/delete-project.component';
import { MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackBar } from 'src/app/utils/custom-snackbar';
import { DataTreeFetcher } from 'src/app/models/utils/DataTreeFetcher';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css'],
})
export class ProjectListComponent implements OnInit {
  constructor(private projectService: ProjectService, private dialog: MatDialog, private snackBar: MatSnackBar) {}
  fileNameDialogRef: MatDialogRef<AddProjectComponent>;
  isDeletable = true;

  customSnackBar: CustomSnackBar = new CustomSnackBar(this.snackBar);

  treeControl = new FlatTreeControl<FlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.child_project
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  ngOnInit(): void {
    this.refreshList({ expanded: true });
  }

  // tslint:disable-next-line:variable-name
  private _transformer(node: ProjectItem, level: number) {
    const nodeNochild: ProjectItem = new ProjectItem(node);
    nodeNochild.child_project = [];
    return {
      expandable: !!node.child_project && node.child_project.length > 0,
      name: node.name,
      projectItem: nodeNochild,
      id: node.id,
      parent_id: node.parent_id,
      nbLignesDeTemps: node.nbLignesDeTemps,
      nbChild: node.child_project.length,
      level,
    };
  }

  async openEditDialog(projet: ProjectItem) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      projet,
    };
    dialogConfig.minWidth = 600;
    this.fileNameDialogRef = this.dialog.open(AddProjectComponent, dialogConfig);

    const result = await this.fileNameDialogRef.afterClosed().toPromise();
    if (result === 'Canceled' || result === undefined) {
      this.customSnackBar.openSnackBar('Action annulée', 'notif-warning');
    } else if (result) {
      this.refreshList({ expanded: true });
      this.customSnackBar.openSnackBar('Le projet a été modifié', 'notif-success');
    }
  }

  async openDeleteDialog(project: ProjectItem) {
    this.isDeletable = await this.projectService.isProjectDeletable(project.id).toPromise();
    const dialogConfig = this.dialog.open(DeleteProjectComponent, {
      data: {
        id: project.id,
        name: project.name,
        isDeletable: this.isDeletable,
      },
      panelClass: 'warning-dialog',
    });
    const result = await dialogConfig.afterClosed().toPromise();
    if (result && result !== 'Canceled') {
      try {
        await this.projectService.deleteProject(project.id).toPromise();
        this.customSnackBar.openSnackBar(`Le projet ${project.name} a été supprimé`, 'notif-success');
        await this.refreshList({ expanded: true });
      } catch (err) {
        this.customSnackBar.openSnackBar(`${err.error.name} - ${err.error.message} `, 'notif-error');
      }
    }
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  async refreshList(opts?: refreshOption) {
    // let project = new ProjectItem();
    const items: ProjectItem[] = await this.projectService.getAllProject().toPromise();
    const itemsTree = DataTreeFetcher.fetchProjectTree({
      itemList: items,
      fieldsNames: {
        childs: 'child_project',
        id: 'id',
        parentId: 'parent_id',
      },
    });
    this.dataSource.data = itemsTree;
    if (opts.expanded) {
      this.treeControl.expandAll();
    }
  }
}

// tslint:disable-next-line:class-name
interface refreshOption {
  expanded: boolean;
}

/** Flat node with expandable and level information */
interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}
