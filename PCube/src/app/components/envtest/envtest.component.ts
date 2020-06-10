import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EnvTestService } from 'src/app/services/envtest.service';


@Component({
  selector: 'app-envtest',
  templateUrl: './envtest.component.html',
  styleUrls: ['./envtest.component.css']
})

export class EnvTestComponent implements OnInit {
  message = '';
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  constructor(private auth: EnvTestService,
              private router: Router) { }

  ngOnInit() {
  }

  onSubmit() {
    const username = this.loginForm.get('username').value;
    const password = this.loginForm.get('password').value;
    console.log(`logging in: ${username}`);
    this.auth.authenticate(username, password).subscribe(
      () => {
        this.router.navigate(['/']);
      },
      (error) => {
        this.message = error;
      }
    );
  }
}
