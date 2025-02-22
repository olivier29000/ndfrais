import { computed, Injectable } from '@angular/core';
import { UserStoreService } from './user-store.service';
import { UserEffectService } from './user-effect.service';
import { Action } from 'src/app/models/action.model';
import { ServerService } from 'src/app/services/server.service';
import {
  eachDayOfInterval,
  lastDayOfMonth,
  startOfDay,
  startOfMonth
} from 'date-fns';
import { WEEK_STATE, WORK_STATE } from 'src/app/models/day-app.model';

@Injectable({
  providedIn: 'root'
})
export class UserServerService {
  constructor(
    private userStore: UserStoreService,
    private userEffect: UserEffectService,
    private server: ServerService
  ) {}
  eventList = this.userStore.eventList;
  userAllContratList = this.server.userAllContratList;
  historiqueActionList = this.userStore.historiqueActionList;
  userDayAppList = this.userStore.userDayAppList;
  currentDateRecap = this.userStore.currentDateRecap;
  recapByContratDayAppList = computed(() => {
    const dayListMonth = eachDayOfInterval({
      start: startOfMonth(this.currentDateRecap()),
      end: lastDayOfMonth(this.currentDateRecap())
    });
    return this.userStore.recapByContratDayAppList().map((recapByContrat) => ({
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
  getAllEventByContratIdAndPeriod(
    start: Date,
    end: Date,
    contratId: string
  ): void {
    this.userEffect.getAllEventByContratIdAndPeriod(start, end, contratId);
  }
  previousMonth(): void {
    this.userEffect.previousMonth();
  }
  nextMonth(): void {
    this.userEffect.nextMonth();
  }
  idContratUserApp = this.userStore.idContratUserApp;
  getRecap(): void {
    this.userEffect.getRecap(this.currentDateRecap());
  }

  openPdfDisplayModal(idPdf: number): void {
    this.userEffect.openPdfDisplayModal(idPdf);
  }
  userGetHistoriqueActionList(idContrat: string): void {
    this.userEffect.userGetHistoriqueActionList(idContrat);
  }
  getUserDayAppListByContratId(idContrat: string): void {
    this.userEffect.getUserDayAppListByContratId(idContrat);
  }

  askAction(action: Action, idContrat: string): void {
    this.userEffect.askAction(action, idContrat);
  }
}
