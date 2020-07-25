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
import { AddUserComponent } from './components/domain/user/add-user/add-user.component';
import { ExpenseAccountsComponent } from 'src/app/components/pages/expense-accounts/expense-accounts.component';
import { ManageTimelineComponent } from 'src/app/components/pages/timeline/manage-timeline/manage-timeline.component';
import { AddingTimelineComponent } from 'src/app/components/pages/timeline/adding-timeline/adding-timeline.component';
import { ModifyingTimelineComponent } from 'src/app/components/pages/timeline/modifying-timeline/modifying-timeline.component';
import { AddExpenseAccountComponent } from './components/domain/expense-account/add-expense-account/add-expense-account.component';

import { ReportsComponent } from './components/pages/reports/reports/reports.component';

import { ContactUsComponent } from './components/pages/contact-us/contact-us.component';

import { TimelineComponent } from './components/pages/timeline/timeline.component';
import { NotFoundComponent } from './components/pages/not-found/not-found.component';
import { ServerDownComponent } from './components/pages/server-down/server-down.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'gestion-des-activités',
        component: ActivityComponent,
        canActivate: [ProjectManagerGuard]
      },
      {
        path: 'rapport',
        component: ReportsComponent
      },
      {
        path: 'contactez-nous',
        component: ContactUsComponent
      },
      {
        path: 'gestion-des-projets',
        component: ProjectComponent,
        canActivate: [ProjectManagerGuard]
      },
      {
        path: 'gestion-des-utilisateurs',
        component: UsersComponent,
        canActivate: [AdminGuard]
      },
      {
        path: 'gestion-des-comptes-de-depenses',
        component: ExpenseAccountsComponent,
        canActivate: [AdminGuard]
      },
      {
        path: 'gestion-des-lignes-de-temps',
        component: TimelineComponent,
        canActivate: [ProjectManagerGuard]
      },
      {
        path: 'gestion-des-lignes-de-temps/ajouter-ligne-de-temps',
        component: AddingTimelineComponent,
        canActivate: [ProjectManagerGuard]
      },
      {
        path: 'gestion-des-lignes-de-temps/modifier-ligne-de-temps/:id',
        component: ModifyingTimelineComponent,
        canActivate: [ProjectManagerGuard]
      },
      {
        path: '404', 
        component: NotFoundComponent
      },
      {
        path: 'serveur-indisponible', 
        component: ServerDownComponent
      },
    ]
  },
  {
    path: '**',
    redirectTo: '/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
