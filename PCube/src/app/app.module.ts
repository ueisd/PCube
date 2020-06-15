import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EnvTestComponent } from './components/envtest/envtest.component';
import { ReactiveFormsModule } from '@angular/forms';

// Auth
import { AuthInterceptor } from 'src/app/services/auth/auth.interceptor';
import { LoginComponent } from './components/pages/login/login.component';
import { LogoutComponent } from './components/layouts/logout/logout.component';
import { HomeComponent } from './components/pages/home/home.component';
import { AccessDeniedComponent } from './components/pages/access-denied/access-denied.component';
import { AdminContentComponent } from './components/pages/admin-content/admin-content.component';
import { ProjectManagerContentComponent } from './components/pages/project-manager-content/project-manager-content.component';
import { MemberContentComponent } from './components/pages/member-content/member-content.component';
import { AddUserComponent } from './components/pages/add-user/add-user.component';


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
    AddUserComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
