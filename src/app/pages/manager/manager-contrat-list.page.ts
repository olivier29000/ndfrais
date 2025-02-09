import { Component, effect, signal, WritableSignal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserApp } from '../../models/user.model';
import { ServerService } from '../../services/server.service';
import { ActivatedRoute } from '@angular/router';
import { ContratListDumb } from '../dumbs/contrat-list.dumb';
import { ContratUserApp } from '../../models/contrat-employe.model';
import { ManagerServerService } from './services/manager-server.service';

@Component({
  template: `<dumb-contrat-list
    [contratEmployeList]="contratUserAppList()"></dumb-contrat-list>`,
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
}
