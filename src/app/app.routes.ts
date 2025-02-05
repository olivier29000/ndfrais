import { LayoutComponent } from './layouts/layout/layout.component';
import { VexRoutes } from '@vex/interfaces/vex-route.interface';
import { LoginPage } from './unlogged-pages/login.page';
import { CreateAccountPage } from './unlogged-pages/create-account.page';
import { EffectService } from './services/effect.service';
import { inject } from '@angular/core';

export const appRoutes: VexRoutes = [
  { path: 'login', component: LoginPage },
  { path: 'create-account', component: CreateAccountPage },
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
            path: 'employes/:idUserApp',
            loadComponent: () =>
              import('./pages/admin/admin-contrats.page').then(
                (m) => m.AdminContratsPage
              )
          },
          {
            path: 'employes/:idUserApp/contrat-detail/:idContratUserApp',
            loadComponent: () =>
              import('./pages/admin/admin-contrat-detail.page').then(
                (m) => m.AdminContratUserAppPage
              )
          }
        ]
      },
      {
        path: 'user',
        children: [
          {
            path: 'planning',
            loadComponent: () =>
              import('./pages/user/user-planning.page').then(
                (m) => m.UserPlanningPage
              )
          },
          {
            path: 'conges/:idContratUserApp',
            loadComponent: () =>
              import('./pages/user/user-conges.page').then(
                (m) => m.UserCongesPage
              )
          }
        ]
      },
      {
        path: 'admin/organigramme',
        loadComponent: () =>
          import('./pages/commun/admin-organigramme.page').then(
            (m) => m.AdminOrganigrammePage
          )
      }
    ]
  },
  {
    path: '*',
    redirectTo: '/user/conges',
    pathMatch: 'full'
  }
];
