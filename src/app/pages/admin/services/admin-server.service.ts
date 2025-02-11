import { Injectable } from '@angular/core';
import { Action } from 'src/app/models/action.model';
import { AdminEffectService } from './admin-effect.service';
import { UserApp } from 'src/app/models/user.model';
import { ContratUserApp } from 'src/app/models/contrat-employe.model';
import { AdminStoreService } from './admin-store.service';

@Injectable({
  providedIn: 'root'
})
export class AdminServerService {
  constructor(
    private adminStore: AdminStoreService,
    private adminEffect: AdminEffectService
  ) {}
  userAppList = this.adminStore.userAppList;
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
  adminContratList = this.adminStore.adminContratList;
  updateUserModal(userApp: UserApp) {
    this.adminEffect.updateUserModal(userApp);
  }

  createContratModal(userApp: UserApp): void {
    this.adminEffect.createContratModal(userApp);
  }

  updateContratModal(contrat: ContratUserApp) {
    this.adminEffect.updateContratModal(contrat);
  }
}
