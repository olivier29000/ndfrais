import {
  Component,
  computed,
  effect,
  signal,
  WritableSignal
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserApp } from '../../models/user.model';
import { ServerService } from '../../services/server.service';
import { ActivatedRoute } from '@angular/router';
import { ContratListDumb } from '../dumbs/contrat-list.dumb';
import { ContratUserApp } from '../../models/contrat-employe.model';
import { ManagerServerService } from './services/manager-server.service';
import { ActionListDumb } from '../dumbs/action-list.dumb';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { Action, ActionDisplay } from 'src/app/models/action.model';

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
export class ManagerValidationListPage {
  actionList = this.managerServer.actionList;
  ngOnInit(): void {}

  openActionListValidRefuseModal(
    action: Action,
    type: 'valid' | 'refuse'
  ): void {
    this.managerServer.openActionListValidRefuseModal(action, type);
  }

  openPdfById(idPdf: number): void {
    this.managerServer.openPdfDisplayModal(idPdf);
  }

  constructor(private managerServer: ManagerServerService) {}
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
