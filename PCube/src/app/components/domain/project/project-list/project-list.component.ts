import { OnInit, Component } from '@angular/core';
import { ProjectItem } from 'src/app/models/project';
import { ProjectService } from 'src/app/services/project/project.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import * as $ from 'jquery/dist/jquery.min.js';
import { FormControl } from '@angular/forms';
import { AddProjectComponent } from '../add-project/add-project.component';
import { DeleteProjectComponent } from 'src/app/components/domain/project/delete-project/delete-project.component';
import { MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackBar } from 'src/app/utils/custom-snackbar';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})

export class ProjectListComponent implements OnInit {

  nameFilter = new FormControl('');
  fileNameDialogRef: MatDialogRef<AddProjectComponent>;
  deleteProjectDialogRef: MatDialogRef<DeleteProjectComponent>;
  isDeletable: Boolean = true;

  constructor(private projectService: ProjectService, private dialog: MatDialog,
    private snackBar: MatSnackBar) { }


  customSnackBar: CustomSnackBar = new CustomSnackBar(this.snackBar)

  ngOnInit(): void {
    this.refreshList({ expanded: true });
  }

  private _transformer = (node: ProjectItem, level: number) => {
    let nodeNochild: ProjectItem = new ProjectItem(node);
    nodeNochild.child_project = [];
    return {
      expandable: !!node.child_project && node.child_project.length > 0,
      name: node.name,
      projectItem: nodeNochild,
      id: node.id,
      parent_id: node.parent_id,
      nbLignesDeTemps: node.nbLignesDeTemps,
      nbChild: node.child_project.length,
      level: level,
    };
  }

  openEditDialog(projet: ProjectItem) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      projet: projet,
    }
    dialogConfig.minWidth = 600;
    this.fileNameDialogRef = this.dialog.open(AddProjectComponent, dialogConfig);

    this.fileNameDialogRef.afterClosed().subscribe(result => {
      if (result == "Canceled" || result == undefined) {
        this.customSnackBar.openSnackBar('Action annulée', 'notif-warning');
      } else if (result) {
        this.refreshList({ expanded: true });
        this.customSnackBar.openSnackBar('Le projet a été modifié', 'notif-success');
      }
    }
    );
  }

  openDeleteDialog(project: ProjectItem) {

    this.projectService.isProjectDeletable(project.id, project.name).subscribe((data) => {
      this.isDeletable = data;
      const dialogConfig = this.dialog.open(DeleteProjectComponent, {
        data: {
          id: project.id,
          name: project.name,
          isDeletable: this.isDeletable
        },
        panelClass: 'warning-dialog'
      });

      dialogConfig.afterClosed().subscribe(result => {

        if (result == "Canceled" || result == undefined) {
          this.customSnackBar.openSnackBar('Action annulée', 'notif-warning');
        } else if (result !== undefined) {
          this.projectService.deleteProject(project.id, project.name).subscribe((data) => {
            this.customSnackBar.openSnackBar('Le projet a été supprimé', 'notif-success');
            this.refreshList({ expanded: true });
          },
            (error) => {
              this.customSnackBar.openSnackBar('Une erreur s\'est produit. Veuillez réessayer', 'notif-error');
            });
        }
      }
      );
    });
  }

  onFilterChanged() {
    this.refreshList({ expanded: true });
  }

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.child_project);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: FlatNode) => node.expandable;

  refreshList(opts?: refreshOption) {
    let project = new ProjectItem();
    project.name = this.nameFilter.value.trim();
    this.projectService.filterProject(project).subscribe(projets => {
      this.dataSource.data = projets;
      if (opts.expanded) this.treeControl.expandAll();
    });
  }
}

interface refreshOption {
  expanded: boolean
}

/** Flat node with expandable and level information */
interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}