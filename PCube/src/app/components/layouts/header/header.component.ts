import { Component, OnInit, ViewChild } from '@angular/core';
import { LogoutComponent } from '../logout/logout.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @ViewChild(LogoutComponent) logOutComponent;

  constructor() { }

  ngOnInit(): void {
  }
}
