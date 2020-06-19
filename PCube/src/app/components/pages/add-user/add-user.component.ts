import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service'
import { UserForm } from 'src/app/Model/user-form';
import { RoleService } from 'src/app/services/role.service'
import { Role } from 'src/app/Model/role';
import { MatDialog } from '@angular/material/dialog';

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
    private roleService: RoleService, private dialog: MatDialog, private fb: FormBuilder){ 
  }

  onSubmit(){
    const name = this.userForm.get("name").value;
    const lname = this.userForm.get("lname").value;
    const email = this.userForm.get("email").value;
    const password = this.userForm.get("password").value
    const roleId = this.userForm.get("roles").value;
    const creerUser = this.isChecked;
    const passwordConfirmation = this.userForm.get("passwordConfirmation").value;
    if (this.passwordsMatch(password, passwordConfirmation)){
      let user = new UserForm(name, lname, email, password, passwordConfirmation, roleId, creerUser);
      this.userService.createUser(user);
      this.router.navigate(['/'])
    }else{
      console.log(passwordConfirmation, password, password === passwordConfirmation)
    }
    
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
