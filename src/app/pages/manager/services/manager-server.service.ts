import { computed, effect, Injectable } from '@angular/core';
import { ManagerEffectService } from './manager-effect.service';
import { Action } from 'src/app/models/action.model';
import { ManagerStoreService } from './manager-store.service';
import {
  eachDayOfInterval,
  lastDayOfMonth,
  startOfDay,
  startOfMonth
} from 'date-fns';
import { WEEK_STATE, WORK_STATE } from 'src/app/models/day-app.model';
import { UtilsService } from 'src/app/services/utils.service';
import { Role } from 'src/app/models/user-connected.model';

@Injectable({
  providedIn: 'root'
})
export class ManagerServerService {
  constructor(
    private managerEffect: ManagerEffectService,
    private managerStore: ManagerStoreService,
    private utils: UtilsService
  ) {
    // this.getAllContratUserApp();
    // this.getActionListByUserApp();
    // effect(
    //   () => {
    //     const userConnected = this.utils.userConnected();
    //     const nbActionList = this.actionList().length;
    //     if (userConnected?.roleList.includes(Role.ROLE_MANAGER)) {
    //       this.utils.pushManagerNbActionList(nbActionList);
    //     }
    //   },
    //   { allowSignalWrites: true }
    // );
  }
  eventList = this.managerStore.eventList;
  getAllEventByContratListAndPeriod(start: Date, end: Date): void {
    this.managerEffect.getAllEventByContratListAndPeriod(start, end);
  }
  historiqueActionList = this.managerStore.historiqueActionList;
  currentYearHistorique = this.managerStore.currentYearHistorique;
  managerGetHistoriqueActionList(): void {
    this.managerEffect.managerGetHistoriqueActionList(
      this.currentYearHistorique()
    );
  }
  currentDateRecap = this.managerStore.currentDateRecap;
  recapByContratDayAppList = computed(() => {
    const dayListMonth = eachDayOfInterval({
      start: startOfMonth(this.currentDateRecap()),
      end: lastDayOfMonth(this.currentDateRecap())
    });
    return this.managerStore
      .recapByContratDayAppList()
      .map((recapByContrat) => ({
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
              workState: WORK_STATE.REPOS
            };
          }
        })
      }));
  });
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
    type: 'valid' | 'refuse' | 'watch'
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
