import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  OnInit,
  Signal,
  signal,
  WritableSignal
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserServerService } from './services/user-server.service';
import { DayListDumb } from '../dumbs/day-list.dumb';
import { ActivatedRoute } from '@angular/router';
import { ActionListDumb } from '../dumbs/action-list.dumb';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { Action } from 'src/app/models/action.model';
import {
  ACTION_STATE,
  DayApp,
  WORK_STATE,
  workStateItem
} from 'src/app/models/day-app.model';
import { UserApp } from 'src/app/models/user.model';
import { WorkStateDumb } from '../dumbs/work-state.dumb';
import Swal from 'sweetalert2';
import { ValidCancelActionModal } from './modals/valid-cancel-action.modal';
@Component({
  template: `
    <div class="px-6 p-6 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-4">
      @for (item of workStateList(); track $index) {
        <dumb-work-state
          [ngStyle]="{
            border: selectedWorkState?.label === item.label ? 'solid' : ''
          }"
          [iconClass]="item.label"
          [workState]="item"
          (click)="selectWorkState(item)"></dumb-work-state>
      }
    </div>
    <div class="px-6">
      @if (selectedWorkState) {
        <dumb-day-list
          [selectedWorkstate]="selectedWorkState.label"
          (selectDayList)="askAction($event)"
          [dayAppList]="userDayAppList()"></dumb-day-list>
      }
    </div>
  `,
  styles: [``],
  standalone: true,
  imports: [CommonModule, DayListDumb, WorkStateDumb]
})
export class UserCongesPage implements OnInit {
  idContratUserApp: WritableSignal<string | null> = signal(null);
  WORK_STATE = WORK_STATE;
  workStateList: Signal<workStateItem[]> = computed(() => {
    const userCurrentContrat = this.userCurrentContrat();
    if (!userCurrentContrat) {
      return [];
    } else {
      const workStateList: workStateItem[] =
        userCurrentContrat.workStateAvailableList.map((workState) => ({
          label: workState,
          icon: 'mat:card_travel',
          nb: '1'
        }));
      return workStateList;
    }
  });
  selectedWorkState: workStateItem | undefined = undefined;
  userDayAppList = this.userServer.userDayAppList;
  userCurrentContrat = computed(() => {
    const idContratUserApp = this.idContratUserApp();
    const userAllContratList = this.userServer.userAllContratList();
    console.log(idContratUserApp);
    console.log(userAllContratList);
    if (idContratUserApp && userAllContratList.length > 0) {
      const userCurrentContrat = userAllContratList.find(
        (c) => c.id === Number(idContratUserApp)
      );
      console.log(userCurrentContrat);
      if (userCurrentContrat) {
        return userCurrentContrat;
      }
    }
    return undefined;
  });
  currentAction: Action | undefined = undefined;
  selectWorkState(workState: workStateItem): void {
    this.selectedWorkState = workState;
    if (this.currentAction) {
      this.currentAction = {
        ...this.currentAction,
        workState: workState.label
      };
    } else {
      this.currentAction = undefined;
    }
  }
  selectDayList(dayAppList: DayApp[]): void {}
  askAction(dayAppList: DayApp[]): void {
    console.log(dayAppList);
    const selectedWorkState = this.selectedWorkState;
    if (dayAppList.length > 0 && selectedWorkState) {
      this.currentAction = {
        id: 0,
        date: new Date(),
        dayAppList,
        workState: selectedWorkState.label,
        state: ACTION_STATE.ASKING,
        userAppAction: new UserApp({}),
        notes: ''
      };
    }
    const idContratUserApp = this.idContratUserApp();
    if (this.currentAction && idContratUserApp) {
      console.log('dialog');
      this.dialog
        .open(ValidCancelActionModal, {
          data: {
            action: this.currentAction
          }
        })
        .afterClosed()
        .subscribe((action: Action) => {
          this.userServer.askAction(action, idContratUserApp);
          this.currentAction = undefined;
        });
    }
  }
  cancelAction(): void {
    this.currentAction = undefined;
  }

  constructor(
    private userServer: UserServerService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    effect(() => {
      const workStateList = this.workStateList();
      if (workStateList && workStateList.length > 0) {
        this.selectWorkState(workStateList[0]);
      }
    });
    effect(
      () => {
        const idContratUserApp = this.idContratUserApp();
        if (idContratUserApp) {
          this.userServer.getUserDayAppListByContratId(idContratUserApp);
        }
      },
      { allowSignalWrites: true }
    );
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idContratUserApp = params.get('idContratUserApp');
      if (idContratUserApp) {
        this.idContratUserApp.set(idContratUserApp);
      }
    });
  }
}
