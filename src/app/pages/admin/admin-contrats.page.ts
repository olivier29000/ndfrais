import { Component, effect, signal, WritableSignal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserApp } from '../../models/user.model';
import { ActivatedRoute } from '@angular/router';
import { ContratListDumb } from '../dumbs/contrat-list.dumb';
import { ContratUserApp } from '../../models/contrat-employe.model';
import { AdminServerService } from './services/admin-server.service';

@Component({
  template: `<dumb-contrat-list
    (createContratModal)="createContratModal()"
    (updateContratModal)="updateContratModal($event)"
    [contratEmployeList]="adminContratList()"
    [userApp]="currentUserApp()"></dumb-contrat-list>`,
  animations: [],
  standalone: true,
  imports: [ContratListDumb]
})
export class AdminContratsPage {
  currentUserApp: WritableSignal<UserApp | undefined> = signal(undefined);
  idUserApp: WritableSignal<string | undefined> = signal(undefined);
  adminContratList = this.adminServer.adminContratList;
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idUserApp = params.get('idUserApp');
      if (idUserApp) {
        this.idUserApp.set(idUserApp);
      }
    });
  }

  createContratModal(): void {
    const currentUserApp = this.currentUserApp();
    if (currentUserApp) {
      this.adminServer.createContratModal(currentUserApp);
    }
  }

  updateContratModal(contrat: ContratUserApp) {
    this.adminServer.updateContratModal(contrat);
  }

  constructor(
    private dialog: MatDialog,
    private adminServer: AdminServerService,
    private route: ActivatedRoute
  ) {
    effect(
      () => {
        const idUserApp = this.idUserApp();
        const userAppList = this.adminServer.userAppList();
        if (idUserApp && userAppList.length > 0) {
          this.currentUserApp.set(
            userAppList.find((u) => u.id === Number(idUserApp))
          );
          this.adminServer.getContratListByUserId(idUserApp);
        }
      },
      { allowSignalWrites: true }
    );
  }
}
