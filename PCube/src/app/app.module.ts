import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EnvTestComponent } from './components/envtest/envtest.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material/material.module';
import {MatNativeDateModule} from '@angular/material/core';

import { AuthInterceptor } from 'src/app/services/auth/auth.interceptor';
import { LoginComponent } from './components/pages/login/login.component';
import { LogoutComponent } from './components/layouts/logout/logout.component';
import { HomeComponent } from './components/pages/home/home.component';
import { AccessDeniedComponent } from './components/pages/access-denied/access-denied.component';
import { AdminContentComponent } from './components/pages/admin-content/admin-content.component';
import { ProjectManagerContentComponent } from './components/pages/project-manager-content/project-manager-content.component';
import { MemberContentComponent } from './components/pages/member-content/member-content.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddActivityComponent } from './components/domain/activity/add-activity/add-activity.component';


import {MaterialAutocomplete} from 'src/app/material/material-autocomplete';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import { ActivityComponent } from './components/pages/activity/activity.component';
import { ActivityListComponent } from './components/domain/activity/activity-list/activity-list.component';
import { ProjectComponent } from './components/pages/project/project.component';
import { ProjectListComponent } from './components/domain/project/project-list/project-list.component';
import { ProjectAddProjectComponent } from './components/domain/project/project-add-project/project-add-project.component';




@NgModule({
  declarations: [
    AppComponent,
    EnvTestComponent,
    LoginComponent,
    LogoutComponent,
    HomeComponent,
    AccessDeniedComponent,
    AdminContentComponent,
    ProjectManagerContentComponent,
    MemberContentComponent,
    UserListComponent,
    AddActivityComponent,
    ActivityComponent,
    ActivityListComponent,
    ProjectComponent,
    ProjectListComponent,
    ProjectAddProjectComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    MaterialModule,
    MaterialAutocomplete,
    BrowserModule
  ],
  exports:[],
  bootstrap: [AppComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }
  ]
})
export class AppModule { }