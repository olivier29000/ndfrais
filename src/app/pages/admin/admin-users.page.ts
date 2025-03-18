import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserApp } from '../../models/user.model';
import { UserListDumb } from '../dumbs/user-app-list.dumb';
import { AdminServerService } from './services/admin-server.service';
import { AdminContratSmart } from './smarts/admin-contrat.smart';
import { ContratUserApp } from 'src/app/models/contrat-employe.model';
import Swal from 'sweetalert2';

@Component({
  template: `
    <dumb-user-app-list
      (createUserModal)="createUserModal()"
      (updateUserModal)="updateUserModal($event)"
      (changeEnabled)="changeEnabled($event)"
      (selectContrat)="selectContrat($event)"
      [title]="'Utilisateurs actifs'"
      [userAppList]="userAppList()"
      (sendEmailLinkOutput)="sendEmailLink($event)">
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

  sendEmailLink(contratUserApp: ContratUserApp & { email: string }): void {
    if (!this.isValidEmail(contratUserApp.email)) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "l'employé n'a pas une adresse email correcte"
      });
    } else {
      this.adminServer.sendEmailLink(contratUserApp);
    }
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
