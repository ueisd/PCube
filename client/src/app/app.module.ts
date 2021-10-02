// modules Angular
import { NgModule }                       from '@angular/core';
import { 
  FormsModule, 
  ReactiveFormsModule 
}                                         from '@angular/forms';
import { BrowserModule }                  from '@angular/platform-browser';
import { BrowserAnimationsModule }        from '@angular/platform-browser/animations';
import { FlexLayoutModule }               from "@angular/flex-layout";
import { HttpClientModule }               from '@angular/common/http';
import { HTTP_INTERCEPTORS }              from '@angular/common/http';
import { RouterModule }                   from '@angular/router';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { 
  MatDialogModule, 
  MAT_DIALOG_DATA, 
  MatDialogRef 
}                                         from '@angular/material/dialog';
import { 
  MatNativeDateModule, 
  DateAdapter, 
  MAT_DATE_LOCALE, 
  MAT_DATE_FORMATS,
}                                         from '@angular/material/core';
import { MaterialModule }                 from './material/material.module';
import { NgSelectModule, }                from '@ng-select/ng-select';
import { NgxMaterialTimepickerModule }    from 'ngx-material-timepicker';
import { MomentDateAdapter }              from '@angular/material-moment-adapter';

// services
import { AuthService }                    from './shared/services/auth.service';
import { UserService }                    from './shared/services/user.service';
import { CurentUserService }              from './shared/services/curent-user.service';

// interceptors
import { AuthInterceptor }                from './shared/interceptors/auth.interceptor';


// routing
import { APP_ROUTING }                    from './app-routing.module';

// guards
import { AuthGuard }                      from './shared/guards/auth.guard';
import { AdminGuard }                     from './shared/guards/admin.guard';
import { ProjectManagerGuard }            from './shared/guards/project_manager.guard';
import { MemberGuard }                    from './shared/guards/member.guard';

// components
import { AppComponent } 
    from './app.component';
import { EnvTestComponent } 
    from './components/envtest/envtest.component';
import { LoginComponent } 
    from './components/pages/login/login.component';
import { HomeComponent } 
    from './components/pages/home/home.component';
import { AddUserComponent } 
    from './components/domain/user/add-user/add-user.component';
import { UserListComponent } 
    from './components/domain/user/user-list/user-list.component';
import { AddActivityComponent } 
    from './components/domain/activity/add-activity/add-activity.component';
import { ActivityComponent } 
    from './components/pages/activity/activity.component';
import { ActivityListComponent } 
    from './components/domain/activity/activity-list/activity-list.component';
import { ProjectComponent } 
    from './components/pages/project/project.component';
import { ProjectListComponent } 
    from './components/domain/project/project-list/project-list.component';
import { AddProjectComponent } 
    from './components/domain/project/add-project/add-project.component';
import { DeleteUserComponent } 
    from './components/domain/user/delete-user/delete-user.component';
import { HeaderComponent } 
    from './components/layouts/header/header.component';
import { SidenavComponent } 
    from './components/layouts/sidenav/sidenav.component';
import { UsersComponent } 
    from './components/pages/users/users.component';
import { ModifyUserComponent } 
    from './components/domain/user/modify-user/modify-user.component';
import { ExpenseAccountsComponent } 
    from './components/pages/expense-accounts/expense-accounts.component';
import { ExpenseAccountListComponent } 
    from './components/domain/expense-account/expense-account-list/expense-account-list.component';
import { DeleteActivityComponent } 
    from './components/domain/activity/delete-activity/delete-activity.component';
import { TimelineComponent } 
    from './components/pages/timeline/timeline.component';
import { DeleteProjectComponent } 
    from './components/domain/project/delete-project/delete-project.component';
import { AddExpenseAccountComponent } 
    from './components/domain/expense-account/add-expense-account/add-expense-account.component';
import { DeleteExpenseAccountComponent } 
    from './components/domain/expense-account/delete-expense-account/delete-expense-account.component';
import { NotFoundComponent } 
    from './components/pages/not-found/not-found.component';
import { ServerDownComponent } 
    from './components/pages/server-down/server-down.component';
import { RequestFormComponent } 
    from './components/domain/reports/request-form/request-form/request-form.component';
import { ReportsComponent } 
    from './components/pages/reports/reports/reports.component';
import { ContactUsComponent } 
    from './components/pages/contact-us/contact-us.component';
import { RequestComponent } 
    from './components/layouts/request/request.component';


const MY_FORMATS = {
  parse: {
    dateInput: 'yyyy-MM-DD',
  },
  display: {
    dateInput: 'yyyy-MM-DD',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'yyyy-MM-DD',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};


@NgModule({
  declarations: [
    AppComponent,
    EnvTestComponent,
    LoginComponent,
    HomeComponent,
    AddUserComponent,
    UserListComponent,
    AddActivityComponent,
    ActivityComponent,
    ActivityListComponent,
    ProjectComponent,
    ProjectListComponent,
    AddProjectComponent,
    DeleteUserComponent,
    HeaderComponent,
    SidenavComponent,
    UsersComponent,
    ModifyUserComponent,
    ExpenseAccountsComponent,
    ExpenseAccountListComponent,
    DeleteActivityComponent,
    TimelineComponent,
    DeleteProjectComponent,
    AddExpenseAccountComponent,
    DeleteExpenseAccountComponent,
    NotFoundComponent,
    ServerDownComponent,
    RequestFormComponent,
    ReportsComponent,
    ContactUsComponent,
    RequestComponent,
  ],
  imports: [
    MatDialogModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    NgSelectModule,
    NgxMaterialTimepickerModule,
    RouterModule.forRoot(APP_ROUTING, { relativeLinkResolution: 'legacy' }),
    // MomentDateModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { 
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, 
      useValue: { appearance: 'fill' } 
    },
    {
      provide: MatDialogRef,
      useValue: {}
    },
    {
      provide: MAT_DIALOG_DATA,
      useValue: {} // Add any data you wish to test if it is passed/used correctly
    },
    AuthService,
    UserService,
    CurentUserService,
    AuthGuard,
    AdminGuard,
    ProjectManagerGuard,
    MemberGuard
  ],
  entryComponents: [AddActivityComponent],
  exports:[UserListComponent, AddActivityComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }