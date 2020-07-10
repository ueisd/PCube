import { Component, OnInit, Output, EventEmitter, Input, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service'
import { RoleService } from 'src/app/services/role/role.service'
import { Role } from 'src/app/models/role';
import { User } from '../../../../models/user';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
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
  hasToRefresh: boolean = true;
  isAdded: boolean;
  
  @Input() isChecked = false;
  @Output() createUser : EventEmitter<any> = new EventEmitter;
  @Output() refreshDataEvent = new EventEmitter<boolean>();

  constructor(private userService:UserService, 
    private roleService: RoleService, 
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AddUserComponent>,
    private snackBar : MatSnackBar){ 
  }

  ngOnInit(): void { 
    this.roleService.getRoles().subscribe(res=>{
      this.roles= res;
    });
    this.isAdded = false;
    this.initForm();
  }

  askForDataRefresh() {
    this.refreshDataEvent.emit(this.hasToRefresh);
  }

  private onSubmitSuccess(){
    this.isAdded = true;
    this.askForDataRefresh();
    this.userForm.reset();
    this.dialogRef.close(true);
  }

  onSubmit(){
    let user = new User();
    user.first_name = this.userForm.get("name").value;
    user.last_name = this.userForm.get("lname").value;
    user.email = this.userForm.get("email").value;
    user.role_id = this.userForm.get("roles").value;
    const password = this.userForm.get("password").value
    const passwordConfirmation = this.userForm.get("passwordConfirmation").value;
    
    if (this.passwordsMatch(password, passwordConfirmation)){
      this.userService.createUser(user, password, passwordConfirmation).subscribe((data) => {
        this.openSnackBar('L\'utilisateur a été ajouté!','notif-success');
        this.onSubmitSuccess();
      },
      (error) => {
        this.openSnackBar('Une erreur s\'est produit. Veuillez réessayer', 'notif-error');
      });
    }else{
      this.isAdded = false;
      console.log(passwordConfirmation, password, password === passwordConfirmation)
    }
  }

  openSnackBar(message, panelClass) {
    this.snackBar.open(message, 'Fermer', {
      duration: 2000,
      horizontalPosition: "right",
      verticalPosition: "bottom",
      panelClass: [panelClass]
    });
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

    private initForm() {
      this.userForm = this.fb.group({
        name : ['', Validators.required],
        lname : ['', Validators.required],
        email : ['', Validators.required], 
        password: ['', Validators.required],
        passwordConfirmation: ['', Validators.required],
        roles: ['', Validators.required]
      },{validators: this.passwordMatchValidator});
    }
}
