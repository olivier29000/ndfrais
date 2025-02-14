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
  historiqueActionList = this.userStore.historiqueActionList;
  userDayAppList = this.userStore.userDayAppList;
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
