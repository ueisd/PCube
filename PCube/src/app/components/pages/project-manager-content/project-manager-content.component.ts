import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-project-manager-content',
  templateUrl: './project-manager-content.component.html',
  styleUrls: ['./project-manager-content.component.css']
})
export class ProjectManagerContentComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit() {}

}
