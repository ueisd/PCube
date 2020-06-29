import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  message = '';
  formGroup: FormGroup;

  constructor(private auth: AuthService,
              private router: Router,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    if(this.auth.isAuthenticated()){
      this.router.navigate(['/']);
    }

    this.createForm();


  }

  createForm(){
    this.formGroup = this.formBuilder.group({
      'email': [null, [Validators.required]],
      'password': [null, [Validators.required]]
    });
  }

  onSubmit() {
    const email = this.formGroup.get('email').value;
    const password = this.formGroup.get('password').value;
    this.auth.authenticate(email, password).subscribe(
      () => {
        this.router.navigate(['/']);
      },
      (error) => {
        this.message = error;
      }
    );
  }
}
