import {
  Component,
  computed,
  effect,
  signal,
  WritableSignal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AdminServerService } from './services/admin-server.service';
import { CalendarDumb } from '../dumbs/calendar/calendar.dumb';
import { CalendarNavSmart } from './smarts/calendar-nav.smart';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ContratUserApp } from 'src/app/models/contrat-employe.model';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { endOfWeek, startOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarNavDumb } from '../dumbs/calendar/calendar-nav.dumb';
interface Display {
  label: string;
  visible: boolean;
}
@Component({
  template: `<vex-page-layout>
      <vex-page-layout-content class="-mt-6 container">
        <div class="card overflow-auto -mt-16" style="margin-top : 50px">
          <div
            class="bg-app-bar px-6 h-16 border-b sticky left-0 flex items-center">
            <span class="flex-1"></span>

            <button
              [matMenuTriggerFor]="columnFilterMenu"
              class="ml-4 flex-none"
              mat-icon-button
              matTooltip="Filter Columns"
              type="button">
              <mat-icon svgIcon="mat:filter_list"></mat-icon>
            </button>

            <button
              class="ml-4 flex-none"
              color="primary"
              mat-mini-fab
              matTooltip="Add UserApp"
              type="button">
              <mat-icon svgIcon="mat:add"></mat-icon>
            </button>
          </div>
          <div class="px-6">
            <dumb-calendar-nav
              [viewDate]="viewDate()"
              (viewDateOutput)="
                calendarViewDateChange($event)
              "></dumb-calendar-nav>

            <mat-tab-group>
              <mat-tab label="PREVU">
                <app-calendar
                  [viewDate]="viewDate()"
                  [events]="eventList()"></app-calendar>
              </mat-tab>
              <mat-tab label="DECLARE">
                <!-- <pre><code [vexHighlight]="checkboxHTML"></code></pre> -->
              </mat-tab>
            </mat-tab-group>
          </div>
        </div></vex-page-layout-content
      ></vex-page-layout
    >
    <mat-menu #columnFilterMenu="matMenu" xPosition="before" yPosition="below">
      @for (contrat of availableContratList(); track contrat) {
        <button
          (click)="toggleContratVisibility(contrat, $event)"
          class="mat-menu-item block">
          <mat-checkbox
            (click)="$event.stopPropagation()"
            [(ngModel)]="contrat.visible"
            color="primary">
            {{ contrat.userApp.nom }}
          </mat-checkbox>
        </button>
      }
    </mat-menu>`,
  animations: [],
  standalone: true,
  imports: [
    VexPageLayoutComponent,
    VexPageLayoutContentDirective,
    CalendarDumb,
    CalendarNavDumb,
    MatMenuModule,
    MatIconModule,
    MatCheckboxModule,
    FormsModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatTabsModule
  ]
})
export class AdminPlanningsPage {
  stateEvents: 'prevu' | 'declare' = 'prevu';
  viewDate: WritableSignal<Date> = signal(new Date());
  calendarViewDateChange(date: Date) {
    this.viewDate.set(date);
  }
  ngOnInit(): void {}
  availableContratList: WritableSignal<
    (ContratUserApp & { visible: boolean })[]
  > = signal([]);
  eventList = this.adminServer.eventList;
  constructor(private adminServer: AdminServerService) {
    effect(
      () =>
        this.availableContratList.set(
          this.adminServer
            .adminAllContratList()
            .map((c) => ({ ...c, visible: true }))
        ),
      { allowSignalWrites: true }
    );
    effect(
      () => {
        const viewDate = this.viewDate();
        this.adminServer.getAllEventByContratListAndPeriod(
          startOfWeek(viewDate, { locale: fr }),
          endOfWeek(viewDate, { locale: fr })
        );
      },
      { allowSignalWrites: true }
    );
  }

  toggleContratVisibility(
    contrat: ContratUserApp & { visible: boolean },
    event: Event
  ) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    this.availableContratList.update((availableContratList) =>
      availableContratList.map((c) =>
        c.id === contrat.id ? { ...c, visible: c.visible } : c
      )
    );
  }
}
