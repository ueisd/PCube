import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialogRef, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-timeline',
  templateUrl: './add-timeline.component.html',
  styleUrls: ['./add-timeline.component.css']
})
export class AddTimelineComponent implements OnInit {

  userProfil = new User();

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

}
