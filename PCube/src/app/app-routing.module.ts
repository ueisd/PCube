import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from 'src/app/components/pages/login/login.component';

import { ActivityComponent } from 'src/app/components/pages/activity/activity.component';
import { ProjectComponent } from 'src/app/components/pages/project/project.component';
import { UsersComponent } from 'src/app/components/pages/users/users.component';
import { AuthGuard } from 'src/app/services/auth/auth.guard';
import { AdminGuard } from 'src/app/services/auth/admin.guard';
import { ProjectManagerGuard } from './services/auth/project_manager.guard';
import { MemberGuard } from './services/auth/member.guard';

import { HomeComponent } from 'src/app/components/pages/home/home.component';
import { AccessDeniedComponent } from 'src/app/components/pages/access-denied/access-denied.component';
import { AddUserComponent } from './components/domain/user/add-user/add-user.component';
import { ExpenseAccountsComponent } from 'src/app/components/pages/expense-accounts/expense-accounts.component';
import { ManageTimelineComponent } from 'src/app/components/pages/timeline/manage-timeline/manage-timeline.component';
import { AddingTimelineComponent } from 'src/app/components/pages/timeline/adding-timeline/adding-timeline.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'activity-managing',
        component: ActivityComponent,
        canActivate: [ProjectManagerGuard]
      },
      {
        path: 'project-managing',
        component: ProjectComponent,
        canActivate: [ProjectManagerGuard]
      },
      {
        path: 'users-managing',
        component: UsersComponent,
        canActivate: [AdminGuard]
      },
      {
        path: 'expense-account-managing',
        component: ExpenseAccountsComponent,
        canActivate: [AdminGuard]
      },
      {
        path: 'denied',
        component: AccessDeniedComponent
      },
      {
        path: 'gerer-ligne-de-temps',
        component: ManageTimelineComponent,
        canActivate: [ProjectManagerGuard]
      },
      {
        path: 'ajouter-ligne-de-temps',
        component: AddingTimelineComponent,
        canActivate: [ProjectManagerGuard]
      },
      {
        path: 'addUser',
        component: AddUserComponent,
        canActivate: [AdminGuard]
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
