import { Injectable } from '@angular/core';
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
  ) {}
  contratUserAppList = this.managerStore.contratUserAppList;
  actionList = this.managerStore.actionList;
  selectedActionList = this.managerStore.selectedActionList;
  getAllContratUserApp(): void {
    this.managerEffect.getAllContratUserApp();
  }

  validActionList(actionList: Action[]): void {
    this.managerEffect.validActionList(actionList);
  }

  refuseActionList(actionList: Action[]): void {
    this.managerEffect.refuseActionList(actionList);
  }

  getActionListByUserApp(): void {
    this.managerEffect.getActionListByUserApp();
  }

  openActionListValidRefuseModal(action: Action): void {
    this.managerStore.selectedActionList.update((selectedActionList) =>
      selectedActionList.concat(action)
    );
    this.managerEffect.openActionListValidRefuseModal();
  }
}
