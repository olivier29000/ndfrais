import { Component, computed } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { format } from 'date-fns';
import { DayLineDumb } from '../dumbs/day-line.dumb';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { fr } from 'date-fns/locale';
import { DayApp } from 'src/app/models/day-app.model';
import { AdminServerService } from './services/admin-server.service';
import { MonthLineRecapDumb } from '../dumbs/month-line-recap.dumb';

@Component({
  template: `<div
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
        <div class="me-3 my-3 ">
          @for (recap of recapByContratDayAppList(); track recap) {
            <dumb-month-line-recap
              (cancelLastOutput)="openActionDayListRefuseModal($event)"
              (validLastOutput)="openActionDayListValidModal($event)"
              [recapMonth]="recap"></dumb-month-line-recap>
          }
        </div>
      </div>
    </div>

    <div class="px-6"></div>`,
  animations: [],
  standalone: true,
  imports: [MonthLineRecapDumb, MatButtonModule, MatIconModule, FormsModule]
})
export class AdminRecapPage {
  recapByContratDayAppList = this.adminServer.recapByContratDayAppList;

  currentMonthRecap = computed(() =>
    format(this.adminServer.currentDateRecap(), 'MMMM yyyy', { locale: fr })
  );
  ngOnInit(): void {
    this.adminServer.getRecap();
  }
  previousMonth(): void {
    this.adminServer.previousMonth();
  }
  nextMonth(): void {
    this.adminServer.nextMonth();
  }
  openActionDayListValidModal(dayApp: DayApp): void {
    if (dayApp.actionDay) {
      this.adminServer.openActionDayListValidModal(dayApp.actionDay.idAction);
    }
  }
  openActionDayListRefuseModal(dayApp: DayApp): void {
    if (dayApp.actionDay) {
      this.adminServer.openActionDayListRefuseModal(dayApp.actionDay.idAction);
    }
  }
  constructor(
    private dialog: MatDialog,
    private adminServer: AdminServerService,
    private route: ActivatedRoute
  ) {}
}
