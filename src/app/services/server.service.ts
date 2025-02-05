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

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  constructor(
    private store: StoreService,
    private effectService: EffectService
  ) {
    effect(() => {
      const userConnected = this.userConnected();
      if (userConnected?.roleList.includes(Role.ROLE_ADMIN)) {
        this.getUserAppList();
      }
      if (userConnected?.roleList.includes(Role.ROLE_USER)) {
        this.getUserContratList();
      }
    });
  }
  userConnected = this.store.userConnected;
  userAppList = this.store.userAppList;
  weekendDays = this.store.weekendDays;
  currentYear = this.store.currentYear;
  ferieList = this.store.ferieList;
  dayListBdd = this.store.dayListBdd;
  adminAllContratList = this.store.adminAllContratList;
  getUserContratList(): void {
    this.effectService.getUserContratList();
  }
  getAllContrat(): void {
    this.effectService.getAllContrat();
  }
  getUserAppList(): void {
    this.effectService.getUserAppList();
  }
  creationCompte(email: string, entreprise: string, password: string): void {
    this.effectService.creationCompte(email, entreprise, password);
  }
  authentification(email: string, password: string): void {
    this.effectService.authentification(email, password);
  }
  getContratListByUserId(idUserApp: string) {
    this.effectService.getContratListByUserId(idUserApp);
  }
  adminContratList = this.store.adminContratList;
  dayAppList = this.store.dayAppList;

  createUser(): void {
    this.effectService.createUserModal();
  }

  updateUserModal(userApp: UserApp) {
    this.effectService.updateUserModal(userApp);
  }

  createContratModal(userApp: UserApp): void {
    this.effectService.createContratModal(userApp);
  }

  updateContratModal(contrat: ContratUserApp) {
    this.effectService.updateContratModal(contrat);
  }

  getDayAppListByContratId(idContrat: string) {
    this.effectService.getDayAppListByContratId(idContrat);
  }
}
