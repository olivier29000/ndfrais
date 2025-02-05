import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserApp } from '../../models/user.model';
import { ServerService } from '../../services/server.service';
import { UserListDumb } from '../dumbs/user-app-list.dumb';

@Component({
  template: `
    <dumb-user-app-list
      (createUserModal)="createUserModal()"
      (updateUserModal)="updateUserModal($event)"
      [userAppList]="userAppList()"></dumb-user-app-list>
  `,
  animations: [],
  standalone: true,
  imports: [UserListDumb]
})
export class AdminUsersPage implements OnInit {
  userAppList = this.server.userAppList;
  createUserModal(): void {
    this.server.createUser();
  }

  updateUserModal(userApp: UserApp) {
    this.server.updateUserModal(userApp);
  }
  constructor(
    private dialog: MatDialog,
    private server: ServerService
  ) {}
  ngOnInit(): void {
    this.server.getUserAppList();
  }
}
