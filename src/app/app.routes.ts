import { LayoutComponent } from './layouts/layout/layout.component';
import { VexRoutes } from '@vex/interfaces/vex-route.interface';
import { LoginPage } from './unlogged-pages/login.page';
import { CreateAccountPage } from './unlogged-pages/create-account.page';
import { EffectService } from './services/effect.service';
import { inject } from '@angular/core';
import { AccueilPage } from './accueil.page';
import { TicketListPage } from './ndfrais/ticket-liste.page';

export const appRoutes: VexRoutes = [
  {
    path: '',
    component: AccueilPage
  },
  { path: 'login', component: LoginPage },
  { path: 'create-account', component: CreateAccountPage },
  {
    path: '',
    canActivate: [() => inject(EffectService).canActivate()],
    component: LayoutComponent,
    children: [
      { path: 'tickets', component: TicketListPage },
      {
        path: '**',
        redirectTo: '/tickets',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/tickets',
    pathMatch: 'full'
  }
];
