import { Component, OnInit } from '@angular/core';
import { EnvTestService } from 'src/app/services/envtest.service';

@Component({
  selector: 'app-envtest',
  templateUrl: './envtest.component.html',
  styleUrls: ['./envtest.component.css']
})
export class EnvTestComponent implements OnInit {
  testMessage:string;

  constructor(private testService:EnvTestService) { }

  ngOnInit(): void {
    this.testService.getTestMessage().subscribe(message =>
      this.testMessage = message
    );
  }

}
