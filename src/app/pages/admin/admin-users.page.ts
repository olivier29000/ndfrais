import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserApp } from '../../models/user.model';
import { UserListDumb } from '../dumbs/user-app-list.dumb';
import { AdminServerService } from './services/admin-server.service';

@Component({
  template: `
    <dumb-user-app-list
      (createUserModal)="createUserModal()"
      (updateUserModal)="updateUserModal($event)"
      (changeEnabled)="changeEnabled($event)"
      [title]="'Utilisateurs actifs'"
      [userAppList]="userAppList()"></dumb-user-app-list>
    <hr />

    <dumb-user-app-list
      [title]="'Utilisateurs désactivés'"
      (changeEnabled)="changeEnabled($event)"
      [userAppList]="userAppListArchived()"></dumb-user-app-list>
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

  constructor(private adminServer: AdminServerService) {}
  ngOnInit(): void {}
}
