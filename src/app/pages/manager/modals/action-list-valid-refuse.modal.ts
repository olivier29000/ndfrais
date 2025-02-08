import { Component, computed, OnInit } from '@angular/core';
import {
  MatBottomSheetModule,
  MatBottomSheetRef
} from '@angular/material/bottom-sheet';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { ManagerServerService } from '../services/manager-server.service';
import { ActionListDumb } from '../../dumbs/action-list.dumb';
import { TableColumn } from '@vex/interfaces/table-column.interface';

@Component({
  template: `<dumb-action-list
    [actionList]="this.selectedActionList()"
    class="sm:col-span-2"></dumb-action-list> `,
  standalone: true,
  imports: [MatListModule, ActionListDumb, MatIconModule, MatBottomSheetModule]
})
export class ActionListValidRefuseModal implements OnInit {
  constructor(
    private _bottomSheetRef: MatBottomSheetRef<ActionListValidRefuseModal>,
    private managerServer: ManagerServerService
  ) {}
  selectedActionList = this.managerServer.selectedActionList;
  ngOnInit() {}

  close() {
    this._bottomSheetRef.dismiss();
  }
}
