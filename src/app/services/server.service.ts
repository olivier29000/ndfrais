import { computed, Injectable } from '@angular/core';
import { StoreService } from './store.service';
import { eachDayOfInterval, format } from 'date-fns';
import { DAY_STATE, DayApp, WORK_STATE } from '../models/day-app.model';
import { UtilsService } from './utils.service';
import { EffectService } from './effect.service';
import { UserApp } from '../models/user.model';
import { NavigationService } from '../core/navigation/navigation.service';
import { ContratUserApp } from '../models/contrat-employe.model';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  constructor(
    private store: StoreService,
    private utilsService: UtilsService,
    private effect: EffectService
  ) {}
  userAppList = this.store.userAppList;
  weekendDays = this.store.weekendDays;
  currentYear = this.store.currentYear;
  ferieList = this.store.ferieList;
  dayListBdd = this.store.dayListBdd;

  getUserAppList(): void {
    this.effect.getUserAppList();
  }
  creationCompte(email: string, entreprise: string, password: string): void {
    this.effect.creationCompte(email, entreprise, password);
  }
  authentification(email: string, password: string): void {
    this.effect.authentification(email, password);
  }
  getContratListByUserId(idUserApp: string) {
    this.effect.getContratListByUserId(idUserApp);
  }
  adminContratList = this.store.adminContratList;
  dayAppMap = computed(() =>
    eachDayOfInterval({
      start: new Date(this.currentYear(), 0, 1),
      end: new Date(this.currentYear(), 11, 31)
    }).reduce(
      (acc, d) => {
        if (acc[format(d, 'yyyy-MM')]) {
          acc[format(d, 'yyyy-MM')].push({
            date: d,
            dayState: this.utilsService.getDayState(
              d,
              this.ferieList(),
              this.weekendDays()
            ),
            workState: this.utilsService.getWorkState(
              d,
              this.ferieList(),
              this.weekendDays(),
              this.dayListBdd()
            ),
            workStateHistory: []
          });
        } else {
          acc[format(d, 'yyyy-MM')] = [
            {
              date: d,
              dayState: this.utilsService.getDayState(
                d,
                this.ferieList(),
                this.weekendDays()
              ),
              workState: this.utilsService.getWorkState(
                d,
                this.ferieList(),
                this.weekendDays(),
                this.dayListBdd()
              ),
              workStateHistory: []
            }
          ];
        }
        return acc;
      },
      {} as { [month: string]: DayApp[] }
    )
  );

  createUser(): void {
    this.effect.createUserModal();
  }

  updateUserModal(userApp: UserApp) {
    this.effect.updateUserModal(userApp);
  }

  createContratModal(userApp: UserApp): void {
    this.effect.createContratModal(userApp);
  }

  updateContratModal(contrat: ContratUserApp) {
    this.effect.updateContratModal(contrat);
  }
}
