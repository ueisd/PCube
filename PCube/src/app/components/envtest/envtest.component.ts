import { Component, OnInit } from '@angular/core';
import { ActivityItem } from 'src/app/models/activity';
import { ProjectService } from 'src/app/services/project/project.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-envtest',
  templateUrl: './envtest.component.html',
  styleUrls: ['./envtest.component.css']
})
export class EnvTestComponent implements OnInit {

  constructor(private projectService: ProjectService) { }

  newActivityForm: FormGroup;
  projectSubscription: Subscription;

  myControl = new FormControl();

  ngOnInit(): void {
    this.initForm();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  onSubmit(){ 
    console.log(this.newActivityForm);
  }

  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  private initForm(){

    //this.projectSubscription = this.projectService.getAllParentProject().subscribe();
    
    this.newActivityForm = new FormGroup({
      'parentProject': new FormControl('', [Validators.required]),
      'activityName': new FormControl('', [Validators.required])
    });
  }
}
