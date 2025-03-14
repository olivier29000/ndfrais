import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserApp } from '../../models/user.model';
import { UserListDumb } from '../dumbs/user-app-list.dumb';
import { AdminServerService } from './services/admin-server.service';
import { AdminContratSmart } from './smarts/admin-contrat.smart';
import { ContratUserApp } from 'src/app/models/contrat-employe.model';

@Component({
  template: `
    <dumb-user-app-list
      (createUserModal)="createUserModal()"
      (updateUserModal)="updateUserModal($event)"
      (changeEnabled)="changeEnabled($event)"
      (selectContrat)="selectContrat($event)"
      [title]="'Utilisateurs actifs'"
      [userAppList]="userAppList()">
    </dumb-user-app-list>

    <hr />

    <dumb-user-app-list
      [title]="'Utilisateurs désactivés'"
      (changeEnabled)="changeEnabled($event)"
      [userAppList]="userAppListArchived()">
    </dumb-user-app-list>
  `,
  animations: [],
  standalone: true,
  imports: [UserListDumb]
})
export class AdminUsersPage implements OnInit {
  userAppList = this.adminServer.userAppList;
  userAppListArchived = this.adminServer.userAppListArchived;
  createUserModal(): void {
    this.adminServer.createUser();
  }

  updateUserModal(userApp: UserApp) {
    this.adminServer.updateUserModal(userApp);
  }

  changeEnabled(userApp: UserApp) {
    this.adminServer.changeEnabled(userApp);
  }

  selectContrat(userApp: UserApp | undefined) {
    if (userApp) {
      this.adminServer.selectedContrat.set(userApp.contratUserApp);
      this.adminServer.openPlanningUserModal(new Date());
    } else {
      this.adminServer.selectedContrat.set(undefined);
    }
  }

  constructor(private adminServer: AdminServerService) {}
  ngOnInit(): void {}
}
