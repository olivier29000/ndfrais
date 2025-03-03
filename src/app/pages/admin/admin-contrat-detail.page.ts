import { Component, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ContratUserApp } from '../../models/contrat-employe.model';
import { DayListDumb } from '../dumbs/day-list.dumb';
import { AdminServerService } from './services/admin-server.service';

@Component({
  template: ` <dumb-day-list [dayAppList]="dayAppList()"></dumb-day-list>`,
  animations: [],
  standalone: true,
  imports: [CommonModule, DayListDumb]
})
export class AdminContratUserAppPage {
  currentContratUserApp: WritableSignal<ContratUserApp | undefined> =
    signal(undefined);
  idContratUserApp: WritableSignal<string | undefined> = signal(undefined);
  dayAppList = this.adminServer.dayAppList;
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idContratUserApp = params.get('idContratUserApp');
      if (idContratUserApp) {
        this.idContratUserApp.set(idContratUserApp);
        this.adminServer.getDayAppListByContratId(idContratUserApp);
      }
    });
  }

  constructor(
    private adminServer: AdminServerService,
    private route: ActivatedRoute
  ) {}
}
