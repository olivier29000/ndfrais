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
            path: 'contrats/:idUserApp',
            loadComponent: () =>
              import('./pages/admin/admin-contrats.page').then(
                (m) => m.AdminContratsPage
              )
          },
          {
            path: 'contrats/:idUserApp/contrat-detail/:idContratUserApp',
            loadComponent: () =>
              import('./pages/admin/admin-contrat-detail.page').then(
                (m) => m.AdminContratUserAppPage
              )
          },
          {
            path: 'recap',
            loadComponent: () =>
              import('./pages/admin/admin-recap.page').then(
                (m) => m.AdminRecapPage
              )
          },
          {
            path: 'validations',
            loadComponent: () =>
              import('./pages/admin/admin-validations.page').then(
                (m) => m.AdminValidationListPage
              )
          },
          {
            path: 'historique',
            loadComponent: () =>
              import('./pages/admin/admin-historique.page').then(
                (m) => m.AdminHistoriquePage
              )
          },
          {
            path: 'plannings',
            loadComponent: () =>
              import('./pages/admin/admin-plannings.page').then(
                (m) => m.AdminPlanningsPage
              )
          },
          {
            path: 'abonnement',
            loadComponent: () =>
              import('./pages/admin/admin-abonnement.page').then(
                (m) => m.AdminAbonnementPage
              )
          }
        ]
      },
      {
        path: 'user',
        children: [
          // {
          //   path: 'planning',
          //   loadComponent: () =>
          //     import('./pages/user/user-planning.page').then(
          //       (m) => m.UserPlanningPage
          //     )
          // },
          {
            path: 'conges/:idContratUserApp',
            loadComponent: () =>
              import('./pages/user/user-conges.page').then(
                (m) => m.UserCongesPage
              )
          },
          {
            path: 'historique/:idContratUserApp',
            loadComponent: () =>
              import('./pages/user/user-historique.page').then(
                (m) => m.UserHistoriquePage
              )
          },
          {
            path: 'equipe/:idContratUserApp',
            loadComponent: () =>
              import('./pages/user/user-equipe.page').then(
                (m) => m.UserEquipePage
              )
          },
          {
            path: 'planning/:idContratUserApp',
            loadComponent: () =>
              import('./pages/user/user-planning.page').then(
                (m) => m.UserPlanningPage
              )
          }
        ]
      },
      {
        path: 'manager',
        children: [
          {
            path: 'contrats',
            loadComponent: () =>
              import('./pages/manager/manager-contrat-list.page').then(
                (m) => m.ManagerContratListPage
              )
          },
          {
            path: 'validations',
            loadComponent: () =>
              import('./pages/manager/manager-validations.page').then(
                (m) => m.ManagerValidationListPage
              )
          },
          {
            path: 'recap',
            loadComponent: () =>
              import('./pages/manager/manager-recap.page').then(
                (m) => m.ManagerRecapPage
              )
          },
          {
            path: 'historique',
            loadComponent: () =>
              import('./pages/manager/manager-historique.page').then(
                (m) => m.ManagerHistoriquePage
              )
          },
          {
            path: 'plannings',
            loadComponent: () =>
              import('./pages/manager/manager-planning-list.page').then(
                (m) => m.ManagerPlanningListPage
              )
          }
        ]
      },
      {
        path: 'organigramme',
        loadComponent: () =>
          import('./pages/commun/admin-organigramme.page').then(
            (m) => m.AdminOrganigrammePage
          )
      },
      {
        path: '**',
        redirectTo: '/organigramme',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/organigramme',
    pathMatch: 'full'
  }
];
