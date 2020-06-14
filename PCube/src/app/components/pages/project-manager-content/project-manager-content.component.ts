import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserListComponent } from 'src/app/components/user-list/user-list.component'
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

@Component({
  selector: 'app-project-manager-content',
  templateUrl: './project-manager-content.component.html',
  styleUrls: ['./project-manager-content.component.css']
})
export class ProjectManagerContentComponent implements OnInit {

  constructor(private http: HttpClient, 
    private dialog: MatDialog) { }

  ngOnInit() {
    this.http.get(environment.api_url + '/api/project-manager-check').subscribe();
  }

  openDialog() {
    this.dialog.open(UserListComponent,{height:'80%',width:'80%'});
  }
}
