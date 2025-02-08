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
import { Action } from 'src/app/models/action.model';

@Component({
  template: `<div class="container">
    <dumb-action-list
      [actionList]="actionList()"
      (clickAction)="openActionListValidRefuseModal($event)"
      class="sm:col-span-2"></dumb-action-list>
  </div>`,
  animations: [],
  standalone: true,
  imports: [ActionListDumb]
})
export class ManagerValidationListPage {
  actionList = this.managerServer.actionList;
  ngOnInit(): void {
    this.managerServer.getActionListByUserApp();
  }

  openActionListValidRefuseModal(action: Action): void {
    this.managerServer.openActionListValidRefuseModal(action);
  }

  constructor(private managerServer: ManagerServerService) {}
}
