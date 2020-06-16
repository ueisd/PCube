import { Component, OnInit, } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin-content',
  templateUrl: './admin-content.component.html',
  styleUrls: ['./admin-content.component.css']
})
export class AdminContentComponent implements OnInit {
  
  constructor(private http: HttpClient, 
              private router: Router) { }

  ngOnInit() {}


  onsubmit(){
    this.router.navigate(["/addUser"]);
  }
}
