import { Route } from '@angular/router';

import { ActivityComponent } from 'src/app/components/pages/activity/activity.component';
import { ProjectComponent } from 'src/app/components/pages/project/project.component';
import { UsersComponent } from 'src/app/components/pages/users/users.component';

import { HomeComponent } from 'src/app/components/pages/home/home.component';
import { ExpenseAccountsComponent } from 'src/app/components/pages/expense-accounts/expense-accounts.component';

import { ReportsComponent } from './components/pages/reports/reports/reports.component';

import { ContactUsComponent } from './components/pages/contact-us/contact-us.component';

import { TimelineComponent } from './components/pages/timeline/timeline.component';
import { NotFoundComponent } from './components/pages/not-found/not-found.component';
import { ServerDownComponent } from './components/pages/server-down/server-down.component';

import { AuthGuard } from './shared/guards/auth.guard';
import { AdminGuard } from './shared/guards/admin.guard';
import { ProjectManagerGuard } from './shared/guards/project_manager.guard';
import { MemberGuard } from './shared/guards/member.guard';


export const APP_ROUTING: Route[] = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'gestion-des-activités',
        component: ActivityComponent,
        canActivate: [AuthGuard, ProjectManagerGuard]
      },
      {
        path: 'rapport',
        component: ReportsComponent,
        canActivate: [AuthGuard, MemberGuard]
      },
      {
        path: 'contactez-nous',
        component: ContactUsComponent
      },
      {
        path: 'gestion-des-projets',
        component: ProjectComponent,
        canActivate: [AuthGuard, ProjectManagerGuard]
      },
      {
        path: 'gestion-des-utilisateurs',
        component: UsersComponent,
        canActivate: [AdminGuard, AdminGuard]
      },
      {
        path: 'gestion-des-comptes-de-depenses',
        component: ExpenseAccountsComponent,
        canActivate: [AuthGuard, AdminGuard]
      },
      {
        path: 'gestion-des-lignes-de-temps',
        component: TimelineComponent,
        canActivate: [AuthGuard, ProjectManagerGuard]
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
