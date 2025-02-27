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
  template: ` <vex-page-layout>
      <vex-page-layout-content class="-mt-6 container">
        <div
          class="my-1 px-6 flex flex-col sm:flex-row items-stretch sm:items-start gap-6">
          <div class="me-3 flex flex-wrap m-3 ">
            @for (contrat of displayedContratList(); track contrat) {
              <div class="flex mx-3">
                <div
                  class="card flex items-center mt-3 px-2"
                  style="width:130px"
                  [style.border]="
                    '3px solid ' +
                    convertHexToRgba(contrat.color || '#000000', 1)
                  ">
                  <div class="flex-auto">
                    <h4 class="body-2 m-0 leading-snug">
                      {{ contrat.poste }}
                    </h4>
                    <h5 class="text-secondary m-0 caption leading-none">
                      {{ contrat.userApp.nom }}
                      {{ contrat.userApp.prenom }}
                    </h5>
                    <h4 class="body-2 m-0 leading-snug">
                      Semaine : {{ hourSemaineMap()[contrat.id ?? ''] }}h
                    </h4>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
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

            <app-calendar
              [viewDate]="viewDate()"
              [events]="eventList()"></app-calendar>
          </div></div></vex-page-layout-content
    ></vex-page-layout>
    <mat-menu #columnFilterMenu="matMenu" xPosition="before" yPosition="below">
      @for (contrat of availableContratList(); track contrat) {
        <button class="mat-menu-item block">
          <mat-checkbox
            (click)="toggleContratVisibility(contrat, $event)"
            [ngModel]="contrat.visible"
            color="primary">
            {{ contrat.poste }}-{{ contrat.userApp.nom }}
            {{ contrat.userApp.prenom }}
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
  hourSemaineMap = computed(() => {
    const displayedContratList = this.displayedContratList();
    const hourSemaineMap: { [coontratId: string]: number } = {};
    for (let displayedContrat of displayedContratList) {
      if (displayedContrat.id) {
        hourSemaineMap[displayedContrat.id] = 0;
      }
    }
    const eventList = this.eventList();
    return eventList.reduce((acc, e) => {
      if (e.end) {
        acc[e.title] =
          acc[e.title] + (e.end.getTime() - e.start.getTime()) / 3600000;
      }

      return acc;
    }, hourSemaineMap);
  });
  ngOnInit(): void {}
  availableContratList: WritableSignal<
    (ContratUserApp & { visible: boolean })[]
  > = signal([]);
  displayedContratList = computed(() => {
    return this.availableContratList().filter((c) => c.visible);
  });
  eventList = computed(() => {
    return this.adminServer
      .eventList()
      .filter((e) =>
        this.displayedContratList().some((c) => c.id && c.id + '' === e.title)
      );
  });
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
    this.availableContratList.set([
      ...this.availableContratList().map((c) =>
        c.id === contrat.id ? { ...c, visible: !c.visible } : c
      )
    ]);
  }

  convertHexToRgba(colorHexa: string, opacity: number): string {
    const hex = colorHexa.replace('#', '');
    // Convertir en valeurs RGB
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    // Retourner le format rgba
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
}
