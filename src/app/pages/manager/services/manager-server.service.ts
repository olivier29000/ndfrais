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
  contratUserAppList = computed(() => {
    const actionList = this.managerStore.actionList();
    console.log(actionList);
    console.log(
      this.managerStore.contratUserAppList().map((c) => ({
        ...c,
        nbActions: actionList.filter((a) =>
          a.dayAppList.some((d) => d.idContrat === c.id)
        ).length
      }))
    );
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
}
