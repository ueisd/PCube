import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EnvTestComponent } from './components/envtest/envtest.component';
import { ReactiveFormsModule } from '@angular/forms';

// Auth
import { AuthInterceptor } from 'src/app/services/auth/auth.interceptor';
import { LoginComponent } from './components/pages/login/login/login.component';
import { LogoutComponent } from './components/layouts/logout/logout/logout.component';


@NgModule({
  declarations: [
    AppComponent,
    EnvTestComponent,
    LoginComponent,
    LogoutComponent
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
