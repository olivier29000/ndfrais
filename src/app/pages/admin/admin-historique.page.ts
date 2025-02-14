import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserApp } from '../../models/user.model';
import { UserListDumb } from '../dumbs/user-app-list.dumb';
import { AdminServerService } from './services/admin-server.service';
import { ActionListDumb } from '../dumbs/action-list.dumb';
import { Action } from 'src/app/models/action.model';

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
export class AdminHistoriquePage implements OnInit {
  constructor(private adminServer: AdminServerService) {}
  historiqueActionList = this.adminServer.historiqueActionList;
  ngOnInit(): void {
    this.adminServer.adminGetHistoriqueActionList();
  }

  openActionListValidRefuseModal(action: Action): void {
    this.adminServer.openActionListValidRefuseModal(action, 'watch');
  }

  openPdfById(idPdf: number): void {
    this.adminServer.openPdfDisplayModal(idPdf);
  }
}
