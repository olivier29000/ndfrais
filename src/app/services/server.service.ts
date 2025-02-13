import { computed, effect, Injectable } from '@angular/core';
import { StoreService } from './store.service';
import { eachDayOfInterval, format } from 'date-fns';
import { WEEK_STATE, DayApp, WORK_STATE } from '../models/day-app.model';
import { UtilsService } from './utils.service';
import { UserApp } from '../models/user.model';
import { NavigationService } from '../core/navigation/navigation.service';
import { ContratUserApp } from '../models/contrat-employe.model';
import { Role } from '../models/user-connected.model';
import { EffectService } from './effect.service';
import { AdminServerService } from '../pages/admin/services/admin-server.service';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  constructor(
    private store: StoreService,
    private effectService: EffectService,
    private adminServer: AdminServerService
  ) {
    effect(
      () => {
        const userConnected = this.userConnected();
        if (userConnected?.roleList.includes(Role.ROLE_ADMIN)) {
          this.adminServer.getUserAppList();
        }
        if (userConnected?.roleList.includes(Role.ROLE_USER)) {
          this.getUserContratList();
        }
      },
      { allowSignalWrites: true }
    );
  }
  getOrganigramme(): void {
    this.effectService.getOrganigramme();
  }
  dataTreeNode = this.store.dataTreeNode;
  managerContratList = this.store.managerContratList;
  userConnected = this.store.userConnected;
  weekendDays = this.store.weekendDays;
  currentYear = this.store.currentYear;
  ferieList = this.store.ferieList;
  dayListBdd = this.store.dayListBdd;
  userAllContratList = this.store.userAllContratList;
  getUserContratList(): void {
    this.effectService.getUserContratList();
  }
  creationCompte(email: string, entreprise: string, password: string): void {
    this.effectService.creationCompte(email, entreprise, password);
  }
  authentification(email: string, password: string): void {
    this.effectService.authentification(email, password);
  }

  dayAppList = this.store.dayAppList;

  getDayAppListByContratId(idContrat: string) {
    this.effectService.getDayAppListByContratId(idContrat);
  }
}
