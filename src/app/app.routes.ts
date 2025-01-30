import { LayoutComponent } from './layouts/layout/layout.component';
import { VexRoutes } from '@vex/interfaces/vex-route.interface';

export const appRoutes: VexRoutes = [
  {
    path: '',
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
        path: 'admin/organigramme',
        loadComponent: () =>
          import('./pages/admin-organigramme.page').then(
            (m) => m.AdminOrganigrammePage
          )
      }
    ]
  }
];
