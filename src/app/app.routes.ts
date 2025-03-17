import { LayoutComponent } from './layouts/layout/layout.component';
import { VexRoutes } from '@vex/interfaces/vex-route.interface';
import { LoginPage } from './unlogged-pages/login.page';
import { CreateAccountPage } from './unlogged-pages/create-account.page';
import { EffectService } from './services/effect.service';
import { inject } from '@angular/core';
import { AccueilPage } from './accueil.page';
import { PLanningEmployePage } from './unlogged-pages/planning-employe.page';

export const appRoutes: VexRoutes = [
  {
    path: '',
    component: AccueilPage
  },
  { path: 'login', component: LoginPage },
  { path: 'create-account', component: CreateAccountPage },
  { path: 'employe/:tokenContrat', component: PLanningEmployePage },
  {
    path: '',
    canActivate: [() => inject(EffectService).canActivate()],
    component: LayoutComponent,
    children: [
      {
        path: 'admin',
        children: [
          {
            path: 'users',
            loadComponent: () =>
              import('./pages/admin/admin-users.page').then(
                (m) => m.AdminUsersPage
              )
          },
          {
            path: 'plannings',
            loadComponent: () =>
              import('./pages/admin/admin-plannings.page').then(
                (m) => m.AdminPlanningsPage
              )
          }
        ]
      },
      {
        path: '**',
        redirectTo: '/users',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/admin/users',
    pathMatch: 'full'
  }
];
