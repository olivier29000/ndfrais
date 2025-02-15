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
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { ActionDisplay } from 'src/app/models/action.model';

@Component({
  template: `<div class="container">
    <dumb-action-list
      [actionList]="historiqueActionList()"
      [columns]="columns"
      [withActions]="false"
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

  columns: TableColumn<ActionDisplay>[] = [
    {
      label: 'Etat',
      property: 'state',
      type: 'text'
    },
    {
      label: 'de',
      property: 'user',
      type: 'text'
    },
    {
      label: 'du',
      property: 'from',
      type: 'text'
    },
    {
      label: 'au',
      property: 'to',
      type: 'text'
    },
    {
      label: 'Nb jours concernés',
      property: 'nbJours',
      type: 'text'
    },
    {
      label: 'Nouveau Statut',
      property: 'nouveauStatut',
      type: 'text',
      cssClasses: ['font-medium']
    },
    {
      label: 'Justificatif',
      property: 'idPdf',
      type: 'number',
      cssClasses: ['font-medium']
    }
  ];
}
