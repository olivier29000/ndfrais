import { Injectable } from '@angular/core';
import { UserStoreService } from './user-store.service';
import { UserEffectService } from './user-effect.service';
import { DayAppAction } from 'src/app/models/day-app-action.model';

@Injectable({
  providedIn: 'root'
})
export class UserServerService {
  constructor(
    private userStore: UserStoreService,
    private userEffect: UserEffectService
  ) {}

  userDayAppList = this.userStore.userDayAppList;

  getUserDayAppListByContratId(idContrat: string): void {
    this.userEffect.getUserDayAppListByContratId(idContrat);
  }

  askDayAppActionList(dayAppActionList: DayAppAction[]): void {
    this.userEffect.askDayAppActionList(dayAppActionList);
  }
}
