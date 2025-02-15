import { Component, OnInit } from '@angular/core';
import { ActionListDumb } from '../dumbs/action-list.dumb';
import { Action, ActionDisplay } from 'src/app/models/action.model';
import { ManagerServerService } from './services/manager-server.service';
import { TableColumn } from '@vex/interfaces/table-column.interface';

@Component({
  template: `<div class="container">
    <dumb-action-list
      [actionList]="historiqueActionList()"
      (openPdfById)="openPdfById($event)"
      [columns]="columns"
      [withActions]="false"
      class="sm:col-span-2"></dumb-action-list>
  </div>`,
  animations: [],
  standalone: true,
  imports: [ActionListDumb]
})
export class ManagerHistoriquePage implements OnInit {
  constructor(private managerServer: ManagerServerService) {}
  historiqueActionList = this.managerServer.historiqueActionList;
  ngOnInit(): void {
    this.managerServer.managerGetHistoriqueActionList();
  }

  openActionListValidRefuseModal(action: Action): void {
    this.managerServer.openActionListValidRefuseModal(action, 'watch');
  }

  openPdfById(idPdf: number): void {
    this.managerServer.openPdfDisplayModal(idPdf);
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
