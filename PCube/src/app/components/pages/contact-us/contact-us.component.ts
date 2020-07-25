import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackBar } from 'src/app/utils/custom-snackbar';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit, AfterViewInit {
  contactUsForm: FormGroup;
  user: User = new User();
  customSnackBar:CustomSnackBar = new CustomSnackBar(this.snackBar)

  constructor(private utilsService : UtilsService,
    private snackBar : MatSnackBar) { }

  ngOnInit(): void {
    this.initForm();
    this.setDefaultValues();
  }

  ngAfterViewInit(): void {
    console.log(this.user);
  }
  
  private initForm() {
    this.contactUsForm = new FormGroup({
      'email': new FormControl('', [Validators.required]),
      'firstName': new FormControl('', [Validators.required]),
      'lastName': new FormControl('', [Validators.required]),
      'comment' : new FormControl('', [Validators.required])
    });
  }

  setDefaultValues() {
    this.contactUsForm.controls['email'].setValue(this.user.email);
    this.contactUsForm.controls['email'].disable();
    this.contactUsForm.controls['firstName'].setValue(this.user.first_name);
    this.contactUsForm.controls['firstName'].disable();
    this.contactUsForm.controls['lastName'].setValue(this.user.last_name);
    this.contactUsForm.controls['lastName'].disable();
  }

  onSubmit() {
    console.log(this.user);
    if(this.contactUsForm.valid){
      const email = this.contactUsForm.controls['email'].value;
      const firstName = this.contactUsForm.controls['firstName'].value;
      const lastName = this.contactUsForm.controls['lastName'].value;
      const comment = this.contactUsForm.controls['comment'].value;

      this.utilsService.emailComment(lastName, firstName, email, comment).subscribe((result) => {
        if(result) {
          this.customSnackBar.openSnackBar('Votre commentaire a été envoyé!', 'notif-success');
        }
      });
    }
  }
}
