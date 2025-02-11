import { Component } from '@angular/core';
import { ActionListDumb } from '../dumbs/action-list.dumb';
import { Action } from 'src/app/models/action.model';
import { AdminServerService } from './services/admin-server.service';

@Component({
  template: `<div class="container">
    <dumb-action-list
      [actionList]="actionList()"
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
}
