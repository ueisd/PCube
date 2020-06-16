import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service'
import { User } from 'src/app/Model/user';


@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  authenticated: boolean;
  accessLevel: number;

  @Output() createUser : EventEmitter<any> = new EventEmitter;
  userForm = new FormGroup({
    name : new FormControl('', Validators.required),
    lname : new FormControl('', Validators.required),
    email: new FormControl('', Validators.required)
  });

  constructor(private router: Router, private userservice:UserService){ 
  }

  onSubmit(){
    const name = this.userForm.get("name").value;
    const lname = this.userForm.get("lname").value;
    const email = this.userForm.get("email").value;
    const user = {name, lname, email};
    console.log(name, lname);
    this.userservice.createUser(user);
    //this.createUser.emit(user);
    this.router.navigate(['/addUser']);
  }
  
  ngOnInit(): void {

  }

}
