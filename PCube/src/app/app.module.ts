import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EnvTestComponent } from './components/envtest/envtest.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material/material.module';
import { MatNativeDateModule, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';

import { LoginComponent } from './components/pages/login/login.component';
import { LogoutComponent } from './components/layouts/logout/logout.component';
import { HomeComponent } from './components/pages/home/home.component';
import { AddUserComponent } from './components/domain/user/add-user/add-user.component';
import { UserListComponent } from './components/domain/user/user-list/user-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddActivityComponent } from './components/domain/activity/add-activity/add-activity.component';

import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { ActivityComponent } from './components/pages/activity/activity.component';
import { ActivityListComponent } from './components/domain/activity/activity-list/activity-list.component';
import { ProjectComponent } from './components/pages/project/project.component';
import { ProjectListComponent } from './components/domain/project/project-list/project-list.component';
import { AddProjectComponent } from './components/domain/project/add-project/add-project.component';
import { DeleteUserComponent } from './components/domain/user/delete-user/delete-user.component';
import { HeaderComponent } from './components/layouts/header/header.component';
import { SidenavComponent } from './components/layouts/sidenav/sidenav.component';
import { UsersComponent } from './components/pages/users/users.component';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModifyUserComponent } from './components/domain/user/modify-user/modify-user.component';
import { ExpenseAccountsComponent } from 'src/app/components/pages/expense-accounts/expense-accounts.component';
import { ExpenseAccountListComponent } from './components/domain/expense-account/expense-account-list/expense-account-list.component';
import { NgSelectModule, NgOption, } from '@ng-select/ng-select';

import { FlexLayoutModule } from "@angular/flex-layout";
import { AddTimelineComponent } from './components/domain/timeline/add-timeline/add-timeline.component';
import { AddTimelineStep1Component } from './components/domain/timeline/add-timeline/add-timeline-step1/add-timeline-step1.component';
import { AddTimelineStep2Component } from './components/domain/timeline/add-timeline/add-timeline-step2/add-timeline-step2.component';
import { AddTimelineStep3Component } from './components/domain/timeline/add-timeline/add-timeline-step3/add-timeline-step3.component';
import { AddTimelineStep4Component } from './components/domain/timeline/add-timeline/add-timeline-step4/add-timeline-step4.component';
import { AddTimelineStep5Component } from './components/domain/timeline/add-timeline/add-timeline-step5/add-timeline-step5.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { TimelineListComponent } from './components/domain/timeline/timeline-list/timeline-list.component';
import { ManageTimelineComponent } from './components/pages/timeline/manage-timeline/manage-timeline.component';
import { AddingTimelineComponent } from './components/pages/timeline/adding-timeline/adding-timeline.component';
import { DeleteTimelineComponent } from './components/domain/timeline/delete-timeline/delete-timeline.component';

import { DeleteActivityComponent } from './components/domain/activity/delete-activity/delete-activity.component';
import { ModifyTimelineComponent } from './components/domain/timeline/modify-timeline/modify-timeline.component';
import { ModifyingTimelineComponent } from './components/pages/timeline/modifying-timeline/modifying-timeline.component';
import { TimelineComponent } from './components/pages/timeline/timeline.component';
import { DeleteProjectComponent } from './components/domain/project/delete-project/delete-project.component';
import { AddExpenseAccountComponent } from './components/domain/expense-account/add-expense-account/add-expense-account.component';
import { DeleteExpenseAccountComponent } from './components/domain/expense-account/delete-expense-account/delete-expense-account.component';
import { NotFoundComponent } from './components/pages/not-found/not-found.component';
import { GlobalHttpInterceptorService } from './services/Interceptor/GlobalHttpInterceptor.service';
import { ServerDownComponent } from './components/pages/server-down/server-down.component';
import { RequestFormComponent } from './components/domain/reports/request-form/request-form/request-form.component';
import { ReportsComponent } from './components/pages/reports/reports/reports.component';
import { ContactUsComponent } from './components/pages/contact-us/contact-us.component';
import { RequestComponent } from './components/layouts/request/request.component';
import { EditComponent } from './components/domain/timelines/edit/edit.component';
import { MomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';

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
    LogoutComponent,
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
    AddTimelineComponent,
    AddTimelineStep1Component,
    AddTimelineStep2Component,
    AddTimelineStep3Component,
    AddTimelineStep4Component,
    AddTimelineStep5Component,
    DeleteActivityComponent,
    TimelineListComponent,
    ManageTimelineComponent,
    AddingTimelineComponent,
    DeleteTimelineComponent,
    ModifyTimelineComponent,
    ModifyingTimelineComponent,
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
    EditComponent,
  ],
  imports: [
    MatDialogModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    NgSelectModule,
    NgxMaterialTimepickerModule,
    // MomentDateModule
  ],
  entryComponents: [AddActivityComponent],
  exports:[UserListComponent, AddActivityComponent],
  bootstrap: [AppComponent],
  providers: [
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
    {
      provide: HTTP_INTERCEPTORS, 
      useClass: GlobalHttpInterceptorService,
       multi: true
    }
  ],
})
export class AppModule { }