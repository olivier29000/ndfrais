import { Component, effect, signal, WritableSignal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserApp } from '../../models/user.model';
import { ServerService } from '../../services/server.service';
import { ActivatedRoute } from '@angular/router';
import { ContratListDumb } from '../dumbs/contrat-list.dumb';
import { ContratUserApp } from '../../models/contrat-employe.model';
import { ManagerServerService } from './services/manager-server.service';
import { TableColumn } from '@vex/interfaces/table-column.interface';

@Component({
  template: `<dumb-contrat-list
    [contratEmployeList]="contratUserAppList()"
    title="contrats actifs"
    [columns]="columns"></dumb-contrat-list>`,
  animations: [],
  standalone: true,
  imports: [ContratListDumb]
})
export class ManagerContratListPage {
  contratUserAppList = this.managerServer.contratUserAppList;
  ngOnInit(): void {}

  constructor(
    private dialog: MatDialog,
    private managerServer: ManagerServerService,
    private route: ActivatedRoute
  ) {}

  columns: TableColumn<ContratUserApp>[] = [
    {
      label: 'Checkbox',
      property: 'checkbox',
      type: 'checkbox',
      visible: true
    },
    {
      label: 'Poste',
      property: 'poste',
      type: 'text',
      visible: true,
      cssClasses: ['font-medium']
    },
    {
      label: 'Date de début',
      property: 'dateBegin',
      type: 'date',
      visible: true,
      cssClasses: ['font-medium']
    },
    {
      label: 'Date de fin',
      property: 'dateEnd',
      type: 'date',
      visible: true,
      cssClasses: ['font-medium']
    },
    {
      label: 'Jours de repos',
      property: 'dayOfWeekReposList',
      type: 'dayOfWeekReposList',
      visible: true,
      cssClasses: ['text-secondary', 'font-medium']
    },
    {
      label: 'cumul congés/mois',
      property: 'nbJourCongeMois',
      type: 'number',
      visible: false,
      cssClasses: ['text-secondary', 'font-medium']
    },
    {
      label: 'cumul rtt/mois',
      property: 'nbJourRttMois',
      type: 'number',
      visible: false,
      cssClasses: ['text-secondary', 'font-medium']
    },
    {
      label: 'heures/semaines',
      property: 'nbHeureSemaine',
      type: 'number',
      visible: false,
      cssClasses: ['text-secondary', 'font-medium']
    },
    {
      label: 'nb demandes',
      property: 'nbActions',
      type: 'badge',
      visible: true,
      cssClasses: ['font-medium']
    }
  ];
}
