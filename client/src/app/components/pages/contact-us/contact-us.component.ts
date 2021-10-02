import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackBar } from 'src/app/utils/custom-snackbar';
import { CurentUserService } from 'src/app/shared/services/curent-user.service'

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  contactUsForm: FormGroup;
  user: User = new User();
  customSnackBar:CustomSnackBar = new CustomSnackBar(this.snackBar)
  isFormValid : boolean = false;

  constructor(private utilsService : UtilsService,
    private snackBar : MatSnackBar,
    private currentUserService : CurentUserService
  ) { }

  async ngOnInit() {
    this.initForm();
    let us = this.currentUserService.curentUser.getValue();
    this.user.email = us.email;
    this.user.first_name = us.firstName;
    this.user.last_name = us.lastName;
    this.setDefaultValues();
  }
  
  initForm() {
    this.contactUsForm = new FormGroup({
      'email': new FormControl('', [Validators.required]),
      'firstName': new FormControl('', [Validators.required]),
      'lastName': new FormControl('', [Validators.required]),
      'comment' : new FormControl('', [Validators.required])
    });
  }

  toggleButton() {
    if(this.contactUsForm.get('comment').value == "")
      this.isFormValid = false;
    else 
      this.isFormValid = true;
  }

  setDefaultValues() {
    this.contactUsForm.controls['email'].setValue(this.user.email);
    this.contactUsForm.controls['email'].disable();
    this.contactUsForm.controls['firstName'].setValue(this.user.first_name);
    this.contactUsForm.controls['firstName'].disable();
    this.contactUsForm.controls['lastName'].setValue(this.user.last_name);
    this.contactUsForm.controls['lastName'].disable();
    this.contactUsForm.controls['comment'].setValue("");
    this.contactUsForm.controls['comment'].setErrors(null);
  }

  async onSubmit() {
    if(this.contactUsForm.valid){
      const email = this.contactUsForm.controls['email'].value;
      const firstName = this.contactUsForm.controls['firstName'].value;
      const lastName = this.contactUsForm.controls['lastName'].value;
      const comment = this.contactUsForm.controls['comment'].value;

      
      try {
        let result = await this.utilsService.emailComment(lastName, firstName, email, comment).toPromise();
        this.customSnackBar.openSnackBar('Votre commentaire a été envoyé!', 'notif-success');
        this.setDefaultValues();
      } catch(error) {
        console.log("Le message n'a pu être envoyé: " + error);
      }
    }
  }
}
