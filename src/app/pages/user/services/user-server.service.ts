import { Injectable } from '@angular/core';
import { UserStoreService } from './user-store.service';
import { UserEffectService } from './user-effect.service';
import { Action } from 'src/app/models/action.model';

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

  askActionList(action: Action): void {
    this.userEffect.askActionList(action);
  }
}
