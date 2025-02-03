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
        path: 'employe',
        redirectTo: '/',
        pathMatch: 'full'
      },
      {
        path: '',
        loadComponent: () =>
          import('./pages/conges.page').then((m) => m.CongesPage)
      },
      {
        path: 'admin/users',
        loadComponent: () =>
          import('./pages/admin-users.page').then((m) => m.AdminUsersPage)
      },
      {
        path: 'admin/employes/:idUserApp',
        loadComponent: () =>
          import('./pages/admin-contrats.page').then((m) => m.AdminContratsPage)
      },
      {
        path: 'admin/organigramme',
        loadComponent: () =>
          import('./pages/admin-organigramme.page').then(
            (m) => m.AdminOrganigrammePage
          )
      }
    ]
  }
];
