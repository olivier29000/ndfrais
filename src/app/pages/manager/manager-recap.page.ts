import {
  Component,
  computed,
  effect,
  signal,
  WritableSignal
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserApp } from '../../models/user.model';
import { ServerService } from '../../services/server.service';
import { ActivatedRoute } from '@angular/router';
import { ContratListDumb } from '../dumbs/contrat-list.dumb';
import { ContratUserApp } from '../../models/contrat-employe.model';
import { ManagerServerService } from './services/manager-server.service';
import { DayListDumb } from '../dumbs/day-list.dumb';
import { format } from 'date-fns';
import { DayLineDumb } from '../dumbs/day-line.dumb';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { fr } from 'date-fns/locale';
import { DayApp } from 'src/app/models/day-app.model';

@Component({
  template: ` <div
      class="my-1 px-6 flex flex-col sm:flex-row items-stretch sm:items-start gap-6">
      <div class="card p-6 flex-auto">
        <div class="headline py-1 px-2 flex justify-center items-center">
          <button mat-icon-button (click)="previousMonth()">
            <mat-icon svgIcon="mat:arrow_back_ios"></mat-icon>
          </button>
          <h2>{{ currentMonthRecap() }}</h2>

          <button mat-icon-button (click)="nextMonth()">
            <mat-icon svgIcon="mat:arrow_forward_ios"></mat-icon>
          </button>
        </div>
        <div class="me-3 flex flex-wrap my-3 ">
          @for (recap of recapByContratDayAppList(); track recap) {
            <div class="flex">
              <div class="card flex items-center mt-3 px-2" style="width:130px">
                <div class="flex-auto">
                  <h4 class="body-2 m-0 leading-snug">
                    {{ recap.contrat.poste }}
                  </h4>
                  <h5 class="text-secondary m-0 caption leading-none">
                    {{ recap.contrat.userApp.nom }}
                    {{ recap.contrat.userApp.prenom }}
                  </h5>
                </div>
              </div>
              <dumb-day-line
                (cancelLastOutput)="openActionDayListRefuseModal($event)"
                (validLastOutput)="openActionDayListValidModal($event)"
                [dayAppList]="recap.dayAppList"></dumb-day-line>
            </div>
          }
        </div>
      </div>
    </div>

    <div class="px-6"></div>`,
  animations: [],
  standalone: true,
  imports: [DayLineDumb, MatButtonModule, MatIconModule, FormsModule]
})
export class ManagerRecapPage {
  recapByContratDayAppList = this.managerServer.recapByContratDayAppList;
  currentMonthRecap = computed(() =>
    format(this.managerServer.currentDateRecap(), 'MMMM yyyy', { locale: fr })
  );
  ngOnInit(): void {
    this.managerServer.getRecap();
  }
  previousMonth(): void {
    this.managerServer.previousMonth();
  }
  nextMonth(): void {
    this.managerServer.nextMonth();
  }
  openActionDayListValidModal(dayApp: DayApp): void {
    if (dayApp.actionDay) {
      this.managerServer.openActionDayListValidModal(dayApp.actionDay.idAction);
    }
  }
  openActionDayListRefuseModal(dayApp: DayApp): void {
    if (dayApp.actionDay) {
      this.managerServer.openActionDayListRefuseModal(
        dayApp.actionDay.idAction
      );
    }
  }
  constructor(
    private dialog: MatDialog,
    private managerServer: ManagerServerService,
    private route: ActivatedRoute
  ) {}
}
