import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  OnInit,
  signal,
  WritableSignal
} from '@angular/core';
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
@Component({
  template: `
    <div class="container">
      @if (currentAction(); as currentAction) {
        <dumb-action-list
          (validAction)="askAction()"
          (refuseAction)="cancelAction()"
          [actionList]="currentAction ? [currentAction] : []"
          class="sm:col-span-2"></dumb-action-list>
      } @else {
        <dumb-action-list
          [actionList]="[]"
          class="sm:col-span-2"></dumb-action-list>
      }
    </div>
    <div
      class="container p-6 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-4">
      @for (item of workStateList; track $index) {
        <dumb-work-state
          [ngStyle]="{
            border: selectedWorkState?.label === item.label ? 'solid' : ''
          }"
          [workState]="item"
          (click)="selectWorkState(item)"></dumb-work-state>
      }
    </div>
    <div class="container">
      <dumb-day-list
        (selectDayList)="selectDayList($event)"
        [dayAppList]="userDayAppList()"></dumb-day-list>
    </div>
  `,
  styles: [``],
  standalone: true,
  imports: [CommonModule, DayListDumb, ActionListDumb, WorkStateDumb]
})
export class UserCongesPage implements OnInit {
  WORK_STATE = WORK_STATE;
  workStateList: workStateItem[] = [
    {
      label: WORK_STATE.CONGE,
      icon: 'mat:group'
    },
    {
      label: WORK_STATE.RTT,
      icon: 'mat:group'
    },
    {
      label: WORK_STATE.ARRET_MALADIE,
      icon: 'mat:group'
    },
    {
      label: WORK_STATE.CONGE_SANS_SOLDE,
      icon: 'mat:group'
    },
    {
      label: WORK_STATE.RECUP,
      icon: 'mat:group'
    },
    {
      label: WORK_STATE.TELETRAVAIL,
      icon: 'mat:group'
    }
  ];
  selectedWorkState: workStateItem = this.workStateList[0];
  selectWorkState(workState: workStateItem): void {
    this.selectedWorkState = workState;
    this.currentAction.set(undefined);
  }
  userDayAppList = this.userServer.userDayAppList;
  currentAction: WritableSignal<Action | undefined> = signal(undefined);
  tableData = computed(() => {
    const currentAction = this.currentAction();
    if (currentAction) {
      return [
        {
          date: currentAction.dayAppList[0].date,
          ancienStatut: currentAction.dayAppList[0].workState,
          nouveauStatut: currentAction.workState
        }
      ];
    } else {
      return [];
    }
  });
  selectDayList(dayAppList: DayApp[]): void {
    if (dayAppList.length > 0) {
      if (!this.selectedWorkState) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: "Sélectionnez un type d'abscence (congé, RTT...)"
        });
      } else {
        this.currentAction.set({
          id: 0,
          date: new Date(),
          dayAppList,
          workState: this.selectedWorkState.label,
          state: ACTION_STATE.ASKING,
          userAppAction: new UserApp({})
        });
      }
    }
  }
  askAction(): void {
    const currentAction = this.currentAction();
    if (currentAction) {
      this.userServer.askAction(currentAction);
      this.currentAction.set(undefined);
    }
  }
  cancelAction(): void {
    this.currentAction.set(undefined);
  }

  constructor(
    private userServer: UserServerService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idContratUserApp = params.get('idContratUserApp');
      if (idContratUserApp) {
        this.userServer.getUserDayAppListByContratId(idContratUserApp);
      }
    });
  }
}
