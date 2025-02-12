import { computed, effect, Injectable } from '@angular/core';
import { Action } from 'src/app/models/action.model';
import { AdminEffectService } from './admin-effect.service';
import { UserApp } from 'src/app/models/user.model';
import { ContratUserApp } from 'src/app/models/contrat-employe.model';
import { AdminStoreService } from './admin-store.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Role } from 'src/app/models/user-connected.model';

@Injectable({
  providedIn: 'root'
})
export class AdminServerService {
  constructor(
    private adminStore: AdminStoreService,
    private adminEffect: AdminEffectService,
    private utils: UtilsService
  ) {
    this.getActionList();
    effect(
      () => {
        const userConnected = this.utils.userConnected();
        const nbActionList = this.actionList().length;
        if (userConnected?.roleList.includes(Role.ROLE_ADMIN)) {
          const userAppList = this.userAppList();
          this.utils.pushChildrenAdmin(userAppList, nbActionList);
        }
      },
      { allowSignalWrites: true }
    );
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
  openActionListValidRefuseModal(
    action: Action,
    type: 'valid' | 'refuse'
  ): void {
    this.adminEffect.openActionListValidRefuseModal(action, type);
  }
  getActionList(): void {
    this.adminEffect.getActionList();
  }
  openPdfDisplayModal(idPdf: number): void {
    this.adminEffect.openPdfDisplayModal(idPdf);
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

  userAppList = computed(() =>
    this.adminStore.userAppList().filter((user) => user.enabled)
  );
  userAppListArchived = computed(() =>
    this.adminStore.userAppList().filter((user) => !user.enabled)
  );
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
  adminContratList = computed(() =>
    this.adminStore.adminContratList().filter((c) => !c.archived)
  );
  adminContratListArchived = computed(() =>
    this.adminStore.adminContratList().filter((c) => c.archived)
  );
  updateUserModal(userApp: UserApp) {
    this.adminEffect.updateUserModal(userApp);
  }

  changeEnabled(userApp: UserApp) {
    this.adminEffect.changeEnabled(userApp);
  }

  createContratModal(userApp: UserApp): void {
    this.adminEffect.createContratModal(userApp);
  }

  updateContratModal(contrat: ContratUserApp) {
    this.adminEffect.updateContratModal(contrat);
  }

  archiveUnarchiveContrat(contrat: ContratUserApp) {
    this.adminEffect.archiveUnarchiveContrat(contrat);
  }
}
