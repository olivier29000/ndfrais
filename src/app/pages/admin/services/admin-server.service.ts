import { computed, effect, Injectable } from '@angular/core';
import { Action } from 'src/app/models/action.model';
import { AdminEffectService } from './admin-effect.service';
import { UserApp } from 'src/app/models/user.model';
import { ContratUserApp } from 'src/app/models/contrat-employe.model';
import { AdminStoreService } from './admin-store.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Role } from 'src/app/models/user-connected.model';
import {
  eachDayOfInterval,
  format,
  lastDayOfMonth,
  startOfDay,
  startOfMonth
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { WEEK_STATE, WORK_STATE } from 'src/app/models/day-app.model';

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
    this.getAllContrat();
    effect(
      () => {
        const userConnected = this.utils.userConnected();
        const nbActionList = this.actionList().length;
        const adminAllContratList = this.adminAllContratList();
        if (userConnected?.roleList.includes(Role.ROLE_ADMIN)) {
          const userAppList = this.userAppList().map((userApp) => ({
            ...userApp,
            nomPrenom: userApp.nom + ' ' + userApp.prenom,
            nbAction: adminAllContratList
              .filter((c) => c.userApp.id === userApp.id)
              .map((c) => c.nbActions)
              .reduce((acc, nb) => acc + nb, 0)
          }));
          this.utils.pushChildrenAdmin(userAppList, nbActionList);
        }
      },
      { allowSignalWrites: true }
    );
  }
  currentDateRecap = this.adminStore.currentDateRecap;
  currentMonthRecap = computed(() =>
    format(this.currentDateRecap(), 'MMMM yyyy', { locale: fr })
  );
  recapByContratDayAppList = computed(() => {
    const dayListMonth = eachDayOfInterval({
      start: startOfMonth(this.currentDateRecap()),
      end: lastDayOfMonth(this.currentDateRecap())
    });
    return this.adminStore.recapByContratDayAppList().map((recapByContrat) => ({
      ...recapByContrat,
      dayAppList: dayListMonth.map((day) => {
        const dayApp = recapByContrat.dayAppList.find(
          (d) => startOfDay(d.date).getTime() === startOfDay(day).getTime()
        );
        if (dayApp) {
          return dayApp;
        } else {
          return {
            id: -1,
            date: day,
            weekState: WEEK_STATE.NORMAL,
            workState: WORK_STATE.HORS_CONTRAT
          };
        }
      })
    }));
  });
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
  adminAllContratList = computed(() => {
    const actionList = this.adminStore.actionList();
    return this.adminStore
      .adminAllContratList()
      .filter((c) => !c.archived)
      .map((c) => ({
        ...c,
        nbActions: actionList.filter((a) =>
          a.dayAppList.some((d) => d.idContrat === c.id)
        ).length
      }));
  });

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
  adminContratList = computed(() => {
    const actionList = this.adminStore.actionList();
    return this.adminStore
      .adminContratList()
      .filter((c) => !c.archived)
      .map((c) => ({
        ...c,
        nbActions: actionList.filter((a) =>
          a.dayAppList.some((d) => d.idContrat === c.id)
        ).length
      }));
  });
  contratUserAppList = computed(() => {});
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
