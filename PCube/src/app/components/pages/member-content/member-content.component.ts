import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-member-content',
  templateUrl: './member-content.component.html',
  styleUrls: ['./member-content.component.css']
})
export class MemberContentComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit() {}

}
