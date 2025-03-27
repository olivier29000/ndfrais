import { effect, Injectable } from '@angular/core';
import { StoreService } from './store.service';
import { Role } from '../models/user-connected.model';
import { EffectService } from './effect.service';
import { Email } from '../models/email.model';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  constructor(
    private store: StoreService,
    private effectService: EffectService
  ) {}
  isLoading = this.store.isLoading;
  openSendEmailModal(mode: 'bug' | 'information' | 'fonctionnality') {
    this.effectService.openSendEmailModal(mode);
  }
  sendEmail(email: Email): void {
    this.effectService.sendEmail(email);
  }
  canChooseNomEntreprise = this.store.canChooseNomEntreprise;
  verifDispoNomEntreprise(nomEntreprise: string): void {
    this.effectService.verifDispoNomEntreprise(nomEntreprise);
  }
  logout(): void {
    this.effectService.logout();
  }
  getOrganigramme(): void {
    this.effectService.getOrganigramme();
  }
  dataTreeNode = this.store.dataTreeNode;
  managerContratList = this.store.managerContratList;
  userConnected = this.store.userConnected;
  weekendDays = this.store.weekendDays;
  currentYear = this.store.currentYear;
  ferieList = this.store.ferieList;
  dayListBdd = this.store.dayListBdd;
  userAllContratList = this.store.userAllContratList;
  getUserContratList(): void {
    this.effectService.getUserContratList();
  }
  creationCompte(email: string, password: string): void {
    this.effectService.creationCompte(email, password);
  }
  authentification(email: string, password: string): void {
    this.effectService.authentification(email, password);
  }
}
