import { Injectable } from '@angular/core';
import { UserStoreService } from './user-store.service';
import { UserEffectService } from './user-effect.service';
import { Action } from 'src/app/models/action.model';
import { ServerService } from 'src/app/services/server.service';

@Injectable({
  providedIn: 'root'
})
export class UserServerService {
  constructor(
    private userStore: UserStoreService,
    private userEffect: UserEffectService,
    private server: ServerService
  ) {}
  userAllContratList = this.server.userAllContratList;
  userDayAppList = this.userStore.userDayAppList;
  getUserDayAppListByContratId(idContrat: string): void {
    this.userEffect.getUserDayAppListByContratId(idContrat);
  }

  askAction(action: Action, idContrat: string): void {
    this.userEffect.askAction(action, idContrat);
  }
}
