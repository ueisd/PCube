import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-server-down',
  templateUrl: './server-down.component.html',
  styleUrls: ['./server-down.component.css']
})
export class ServerDownComponent implements OnInit {
  
  constructor(
    private router: Router
    ) { }

  ngOnInit(): void {
  }

  backToHomepage(){
    this.router.navigate(['/']).then(()=>{
      window.location.reload();
    });
  }

}
