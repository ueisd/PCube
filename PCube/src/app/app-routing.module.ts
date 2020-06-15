import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from 'src/app/components/pages/login/login.component';



import { AuthGuard } from 'src/app/services/auth/auth.guard';
import { AdminGuard } from 'src/app/services/auth/admin.guard';
import { ProjectManagerGuard } from './services/auth/project_manager.guard';
import { MemberGuard } from './services/auth/member.guard';

import { HomeComponent } from 'src/app/components/pages/home/home.component';
import { AccessDeniedComponent } from 'src/app/components/pages/access-denied/access-denied.component';
import { AdminContentComponent } from 'src/app/components/pages/admin-content/admin-content.component';
import { ProjectManagerContentComponent } from 'src/app/components/pages/project-manager-content/project-manager-content.component';
import { MemberContentComponent } from './components/pages/member-content/member-content.component';
import { AddUserComponent } from './components/pages/add-user/add-user.component';



const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'member-content',
        component: MemberContentComponent,
        canActivate: [MemberGuard]
      },
      {
        path: 'project-manager-content',
        component: ProjectManagerContentComponent,
        canActivate: [ProjectManagerGuard]
      },
      {
        path: 'admin-content',
        component: AdminContentComponent,
        canActivate: [AdminGuard]
      },
      {
        path: 'denied',
        component: AccessDeniedComponent
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'addUser',
    component: AddUserComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
