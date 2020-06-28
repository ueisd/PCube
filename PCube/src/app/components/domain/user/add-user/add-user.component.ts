import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service'
import { UserForm } from 'src/app/Model/user-form';
import { RoleService } from 'src/app/services/role.service'
import { Role } from 'src/app/Model/role';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../User';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  authenticated: boolean;
  accessLevel: number;
  roles: Role[];
  userForm : FormGroup;
  @Input() isChecked = false;

  @Output() createUser : EventEmitter<any> = new EventEmitter;


  constructor(private router: Router, private userService:UserService, 
    private roleService: RoleService, private dialog: MatDialog, private fb: FormBuilder,
    private snackBar: MatSnackBar){ 
  }

  onSubmit(){
    let user = new User();
    user.firstName = this.userForm.get("name").value;
    user.lastName = this.userForm.get("lname").value;
    user.email = this.userForm.get("email").value;
    user.roleId = this.userForm.get("roles").value;
    const password = this.userForm.get("password").value
    const passwordConfirmation = this.userForm.get("passwordConfirmation").value;
    if (this.passwordsMatch(password, passwordConfirmation)){
      this.userService.createUser(user, password, passwordConfirmation).subscribe((data) => {
        this.openSnackBar('L\'utilisateur a été ajouté!');
      },
      (error) => {
        this.openSnackBar('Une erreur s\'est produit. Veuillez réessayer');
      });
    }else{
      console.log(passwordConfirmation, password, password === passwordConfirmation)
    }
  }
  
  openSnackBar(message) {
    this.snackBar.open(message, 'Fermer', {
      duration: 2000,
      horizontalPosition: "right",
      verticalPosition: "bottom",
    });
  }

  ngOnInit(): void { 
    this.roleService.getRoless().subscribe(res=>{
      this.roles= res;
    });
    this.userForm = this.fb.group({
      name : ['', Validators.required],
      lname : ['', Validators.required],
      email : ['', Validators.required], 
      password: ['', Validators.required],
      passwordConfirmation: ['', Validators.required],
      roles: ['', Validators.required]
    },{validators: this.passwordMatchValidator});
  }

  clicked = (any) => {  
    const email = this.userForm.get('email');
    const password = this.userForm.get('password');
    const passwordConfirmation = this.userForm.get('passwordConfirmation');
    email.disabled ? email.enable() : email.disable();
    password.disabled ? password.enable() : password.disable();
    passwordConfirmation.disabled ? passwordConfirmation.enable() : passwordConfirmation.disable();
    this.isChecked = !this.isChecked;
    }

    passwordsMatch(password:string, confirmation:string){
     return password === confirmation;
    }  

    passwordMatchValidator(control : AbstractControl ){
      let password = control.get("password").value;
      let confirmPassword = control.get("passwordConfirmation").value;
      if (password === confirmPassword){
        return null;
      }else{
        control.get('passwordConfirmation').setErrors({ notMatching : true });
      }
    }
}
