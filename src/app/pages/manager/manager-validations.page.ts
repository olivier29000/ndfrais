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

@Component({
  template: `<div class="container">
    <dumb-action-list
      [columns]="tableColumns"
      [data]="tableData()"
      class="sm:col-span-2"></dumb-action-list>
  </div>`,
  animations: [],
  standalone: true,
  imports: [ActionListDumb]
})
export class ManagerValidationListPage {
  dayAppActionList = this.managerServer.dayAppActionList;
  ngOnInit(): void {
    this.managerServer.getDayAppActionListByUserApp();
  }

  constructor(private managerServer: ManagerServerService) {}

  tableData = computed(() =>
    this.dayAppActionList().map((currentAction) => ({
      date: currentAction.dayApp.date,
      ancienStatut: currentAction.dayApp.workState,
      nouveauStatut: currentAction.workState
    }))
  );

  tableColumns: TableColumn<{
    date: Date;
    ancienStatut: string;
    nouveauStatut: string;
  }>[] = [
    {
      label: 'DATE',
      property: 'date',
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
    }
  ];
}
