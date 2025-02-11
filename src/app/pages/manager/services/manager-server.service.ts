import { computed, Injectable } from '@angular/core';
import { ManagerEffectService } from './manager-effect.service';
import { Action } from 'src/app/models/action.model';
import { ManagerStoreService } from './manager-store.service';

@Injectable({
  providedIn: 'root'
})
export class ManagerServerService {
  constructor(
    private managerEffect: ManagerEffectService,
    private managerStore: ManagerStoreService
  ) {
    this.getAllContratUserApp();
    this.getActionListByUserApp();
  }
  currentDateRecap = this.managerStore.currentDateRecap;
  recapByContratDayAppList = this.managerStore.recapByContratDayAppList;
  previousMonth(): void {
    this.managerEffect.previousMonth();
  }
  nextMonth(): void {
    this.managerEffect.nextMonth();
  }
  getRecap(): void {
    this.managerEffect.getRecap(this.currentDateRecap());
  }

  contratUserAppList = computed(() => {
    const actionList = this.managerStore.actionList();
    return this.managerStore.contratUserAppList().map((c) => ({
      ...c,
      nbActions: actionList.filter((a) =>
        a.dayAppList.some((d) => d.idContrat === c.id)
      ).length
    }));
  });
  actionList = this.managerStore.actionList;
  getAllContratUserApp(): void {
    this.managerEffect.getAllContratUserApp();
  }

  validAction(action: Action): void {
    this.managerEffect.validAction(action);
  }

  refuseAction(action: Action): void {
    this.managerEffect.refuseAction(action);
  }

  getActionListByUserApp(): void {
    this.managerEffect.getActionListByUserApp();
  }

  openActionListValidRefuseModal(
    action: Action,
    type: 'valid' | 'refuse'
  ): void {
    this.managerEffect.openActionListValidRefuseModal(action, type);
  }

  openActionDayListValidModal(idAction: number): void {
    const action = this.actionList().find((a) => a.id === idAction);
    if (action) {
      this.managerEffect.openActionListValidRefuseModal(action, 'valid');
    }
  }
  openActionDayListRefuseModal(idAction: number): void {
    const action = this.actionList().find((a) => a.id === idAction);
    if (action) {
      this.managerEffect.openActionListValidRefuseModal(action, 'refuse');
    }
  }

  openPdfDisplayModal(idPdf: number): void {
    this.managerEffect.openPdfDisplayModal(idPdf);
  }
}
