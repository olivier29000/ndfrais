import { Injectable } from '@angular/core';
import { ManagerEffectService } from './manager-effect.service';
import { DayAppAction } from 'src/app/models/day-app-action.model';
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
  dayAppActionList = this.managerStore.dayAppActionList;

  getAllContratUserApp(): void {
    this.managerEffect.getAllContratUserApp();
  }

  validDayAppActionList(dayAppActionList: DayAppAction[]): void {
    this.managerEffect.validDayAppActionList(dayAppActionList);
  }

  refuseDayAppActionList(dayAppActionList: DayAppAction[]): void {
    this.managerEffect.refuseDayAppActionList(dayAppActionList);
  }

  getDayAppActionListByUserApp(): void {
    this.managerEffect.getDayAppActionListByUserApp();
  }
}
