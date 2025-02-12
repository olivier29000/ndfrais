import { Component, effect, signal, WritableSignal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserApp } from '../../models/user.model';
import { ActivatedRoute } from '@angular/router';
import { ContratListDumb } from '../dumbs/contrat-list.dumb';
import { ContratUserApp } from '../../models/contrat-employe.model';
import { AdminServerService } from './services/admin-server.service';

@Component({
  template: `<dumb-contrat-list
      [title]="'Contrat(s) actif(s)'"
      (createContratModal)="createContratModal()"
      (updateContratModal)="updateContratModal($event)"
      (archiveUnarchive)="archiveUnarchiveContrat($event)"
      [contratEmployeList]="adminContratList()"
      [userApp]="currentUserApp()"></dumb-contrat-list>
    <hr />
    <dumb-contrat-list
      [title]="'Contrat(s) archivé(s)'"
      [contratEmployeList]="adminContratListArchived()"
      (archiveUnarchive)="archiveUnarchiveContrat($event)"
      [userApp]="currentUserApp()"></dumb-contrat-list>`,
  animations: [],
  standalone: true,
  imports: [ContratListDumb]
})
export class AdminContratsPage {
  currentUserApp: WritableSignal<UserApp | undefined> = signal(undefined);
  idUserApp: WritableSignal<string | undefined> = signal(undefined);
  adminContratList = this.adminServer.adminContratList;
  adminContratListArchived = this.adminServer.adminContratListArchived;
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idUserApp = params.get('idUserApp');
      if (idUserApp) {
        this.idUserApp.set(idUserApp);
      }
    });
  }
  archiveUnarchiveContrat(contrat: ContratUserApp) {
    this.adminServer.archiveUnarchiveContrat(contrat);
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
