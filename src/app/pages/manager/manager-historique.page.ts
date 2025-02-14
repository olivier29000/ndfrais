import { Component, OnInit } from '@angular/core';
import { ActionListDumb } from '../dumbs/action-list.dumb';
import { Action } from 'src/app/models/action.model';
import { ManagerServerService } from './services/manager-server.service';

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
}
