import { Injectable } from '@angular/core';
import { Action } from 'src/app/models/action.model';
import { AdminEffectService } from './admin-effect.service';
import { UserApp } from 'src/app/models/user.model';
import { ContratUserApp } from 'src/app/models/contrat-employe.model';
import { AdminStoreService } from './admin-store.service';

@Injectable({
  providedIn: 'root'
})
export class AdminServerService {
  constructor(
    private adminStore: AdminStoreService,
    private adminEffect: AdminEffectService
  ) {
    this.getActionList();
  }
  currentDateRecap = this.adminStore.currentDateRecap;
  recapByContratDayAppList = this.adminStore.recapByContratDayAppList;
  actionList = this.adminStore.actionList;

  openActionDayListValidModal(idAction: number): void {
    const action = this.actionList().find((a) => a.id === idAction);
    if (action) {
      this.adminEffect.openActionListValidRefuseModal(action, 'valid');
    }
  }
  openActionDayListRefuseModal(idAction: number): void {
    const action = this.actionList().find((a) => a.id === idAction);
    console.log(action);
    console.log(this.actionList());
    if (action) {
      this.adminEffect.openActionListValidRefuseModal(action, 'refuse');
    }
  }
  getActionList(): void {
    this.adminEffect.getActionList();
  }
  previousMonth(): void {
    this.adminEffect.previousMonth();
  }
  nextMonth(): void {
    this.adminEffect.nextMonth();
  }
  getRecap(): void {
    this.adminEffect.getRecap(this.currentDateRecap());
  }

  validAction(action: Action): void {
    this.adminEffect.validAction(action);
  }

  refuseAction(action: Action): void {
    this.adminEffect.refuseAction(action);
  }

  userAppList = this.adminStore.userAppList;
  adminAllContratList = this.adminStore.adminAllContratList;

  createUser(): void {
    this.adminEffect.createUserModal();
  }
  getContratListByUserId(idUserApp: string) {
    this.adminEffect.getContratListByUserId(idUserApp);
  }

  getAllContrat(): void {
    this.adminEffect.getAllContrat();
  }
  getUserAppList(): void {
    this.adminEffect.getUserAppList();
  }
  adminContratList = this.adminStore.adminContratList;
  updateUserModal(userApp: UserApp) {
    this.adminEffect.updateUserModal(userApp);
  }

  createContratModal(userApp: UserApp): void {
    this.adminEffect.createContratModal(userApp);
  }

  updateContratModal(contrat: ContratUserApp) {
    this.adminEffect.updateContratModal(contrat);
  }
}
