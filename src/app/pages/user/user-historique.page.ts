import {
  Component,
  effect,
  OnInit,
  signal,
  WritableSignal
} from '@angular/core';
import { ActionListDumb } from '../dumbs/action-list.dumb';
import { UserServerService } from './services/user-server.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  template: `<div class="container">
    <dumb-action-list
      [actionList]="historiqueActionList()"
      (openPdfById)="openPdfById($event)"
      class="sm:col-span-2"></dumb-action-list>
  </div>`,
  animations: [],
  standalone: true,
  imports: [ActionListDumb]
})
export class UserHistoriquePage implements OnInit {
  idContratUserApp: WritableSignal<string | null> = signal(null);
  constructor(
    private route: ActivatedRoute,
    private userServer: UserServerService
  ) {
    effect(
      () => {
        const idContratUserApp = this.idContratUserApp();
        if (idContratUserApp) {
          this.userServer.userGetHistoriqueActionList(idContratUserApp);
        }
      },
      { allowSignalWrites: true }
    );
  }
  historiqueActionList = this.userServer.historiqueActionList;
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idContratUserApp = params.get('idContratUserApp');
      if (idContratUserApp) {
        this.idContratUserApp.set(idContratUserApp);
      }
    });
  }

  openPdfById(idPdf: number): void {
    this.userServer.openPdfDisplayModal(idPdf);
  }
}
