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
import { DayAppAction } from 'src/app/models/day-app-action.model';
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
      <dumb-action-list
        (valid)="askDayAppActionList()"
        [columns]="tableColumns"
        [data]="tableData()"
        class="sm:col-span-2"></dumb-action-list>
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
        (selectDay)="selectDay($event)"
        [dayAppList]="userDayAppList()"></dumb-day-list>
    </div>
  `,
  styles: [``],
  standalone: true,
  imports: [CommonModule, DayListDumb, ActionListDumb, WorkStateDumb]
})
export class UserCongesPage implements OnInit {
  WORK_STATE = WORK_STATE;
  selectedWorkState: workStateItem | undefined = undefined;
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
  selectWorkState(workState: workStateItem): void {
    this.selectedWorkState = workState;
  }
  userDayAppList = this.userServer.userDayAppList;
  currentActionList: WritableSignal<DayAppAction[]> = signal([]);
  tableData = computed(() =>
    this.currentActionList().map((currentAction) => ({
      date: currentAction.dayApp.date,
      ancienStatut: currentAction.dayApp.workState,
      nouveauStatut: currentAction.workState
    }))
  );
  selectDay(dayApp: DayApp): void {
    if (!this.selectedWorkState) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Sélectionnez un type d'abscence (congé, RTT...)"
      });
    }
    this.currentActionList.update((currentActionList) => {
      if (
        this.selectedWorkState &&
        !currentActionList.some(
          (currentAction) => currentAction.dayApp.id === dayApp.id
        )
      ) {
        return currentActionList.concat({
          id: 0,
          date: new Date(),
          dayApp,
          workState: this.selectedWorkState.label,
          state: ACTION_STATE.ASKING,
          userAppAction: new UserApp({})
        });
      }
      return currentActionList;
    });
  }
  askDayAppActionList(): void {
    this.userServer.askDayAppActionList(this.currentActionList());
  }

  tableColumns: TableColumn<{
    date: Date;
    ancienStatut: string;
    nouveauStatut: string;
  }>[] = [
    {
      label: 'DATE',
      property: 'date',
      type: 'text'
    },
    {
      label: 'Ancien statut',
      property: 'ancienStatut',
      type: 'text',
      cssClasses: ['font-medium']
    },
    {
      label: 'Nouveau Statut',
      property: 'nouveauStatut',
      type: 'text',
      cssClasses: ['font-medium']
    }
  ];
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
