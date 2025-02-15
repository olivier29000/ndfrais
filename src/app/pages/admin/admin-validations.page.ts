import { Component } from '@angular/core';
import { ActionListDumb } from '../dumbs/action-list.dumb';
import { Action, ActionDisplay } from 'src/app/models/action.model';
import { AdminServerService } from './services/admin-server.service';
import { TableColumn } from '@vex/interfaces/table-column.interface';

@Component({
  template: `<div class="container">
    <dumb-action-list
      [actionList]="actionList()"
      [columns]="columns"
      (validAction)="openActionListValidRefuseModal($event, 'valid')"
      (openPdfById)="openPdfById($event)"
      (refuseAction)="openActionListValidRefuseModal($event, 'refuse')"
      class="sm:col-span-2"></dumb-action-list>
  </div>`,
  animations: [],
  standalone: true,
  imports: [ActionListDumb]
})
export class AdminValidationListPage {
  actionList = this.adminServer.actionList;
  ngOnInit(): void {}

  openActionListValidRefuseModal(
    action: Action,
    type: 'valid' | 'refuse'
  ): void {
    this.adminServer.openActionListValidRefuseModal(action, type);
  }

  openPdfById(idPdf: number): void {
    this.adminServer.openPdfDisplayModal(idPdf);
  }

  constructor(private adminServer: AdminServerService) {}

  columns: TableColumn<ActionDisplay>[] = [
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
      label: 'Ancien statut',
      property: 'ancienStatut',
      type: 'text',
      cssClasses: ['font-medium']
    },
    {
      label: 'Nouveau Statut',
      property: 'nouveauStatut',
      type: 'text',
      cssClasses: ['font-medium']
    },
    {
      label: 'Notes',
      property: 'notes',
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
