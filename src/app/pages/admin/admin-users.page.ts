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
      <tr>
        <td colspan="5" class="text-center text-gray-500">
          Ceci est un contenu personnalisé entre l'en-tête et les lignes
        </td>
      </tr>
    </dumb-user-app-list>
    @if (selectedContrat()) {
      <smart-admin-contrat
        [currentContrat]="selectedContrat()"></smart-admin-contrat>
    }
    <hr />

    <dumb-user-app-list
      [title]="'Utilisateurs désactivés'"
      (changeEnabled)="changeEnabled($event)"
      [userAppList]="userAppListArchived()">
    </dumb-user-app-list>
  `,
  animations: [],
  standalone: true,
  imports: [UserListDumb, AdminContratSmart]
})
export class AdminUsersPage implements OnInit {
  userAppList = this.adminServer.userAppList;
  userAppListArchived = this.adminServer.userAppListArchived;
  selectedContrat = this.adminServer.selectedContrat;
  createUserModal(): void {
    this.adminServer.createUser();
  }

  updateUserModal(userApp: UserApp) {
    this.adminServer.updateUserModal(userApp);
  }

  changeEnabled(userApp: UserApp) {
    this.adminServer.changeEnabled(userApp);
  }

  selectContrat(userApp: UserApp) {
    console.log(userApp);
    this.adminServer.selectedContrat.set(userApp.contratUserApp);
  }

  constructor(private adminServer: AdminServerService) {}
  ngOnInit(): void {}
}
