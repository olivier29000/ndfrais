import {
  Component,
  computed,
  effect,
  signal,
  WritableSignal
} from '@angular/core';
import { fr } from 'date-fns/locale';
import { UserApp } from '../../models/user.model';
import { ActivatedRoute } from '@angular/router';
import { ContratListDumb } from '../dumbs/contrat-list.dumb';
import { ContratUserApp } from '../../models/contrat-employe.model';
import { AdminServerService } from './services/admin-server.service';
import { CalendarDumb } from '../dumbs/calendar/calendar.dumb';
import { DayLineDumb } from '../dumbs/day-line.dumb';
import { addDays, endOfWeek, isSameWeek, startOfWeek, subDays } from 'date-fns';
import { CalendarNavDumb } from '../dumbs/calendar/calendar-nav.dumb';
import { CalendarEvent } from 'angular-calendar';
import { start } from 'repl';

@Component({
  template: `<dumb-contrat-list
      [title]="'Contrat(s) actif(s)'"
      (createContratModal)="createContratModal()"
      (updateContratModal)="updateContratModal($event)"
      (archiveUnarchive)="archiveUnarchiveContrat($event)"
      [contratEmployeList]="adminContratList()"
      [userApp]="currentUserApp()"
      (selectedContratOutput)="selectContrat($event)"></dumb-contrat-list>
    <hr />
    @if (dayAppList().length > 0) {
      <div class="container">
        <dumb-day-line
          [dayAppList]="dayAppList()"
          [borderedDayAppList]="selectedDays()"></dumb-day-line>
        <dumb-calendar-nav
          [viewDate]="viewDate()"
          (viewDateOutput)="calendarViewDateChange($event)"></dumb-calendar-nav>
        <app-calendar
          [canCreate]="true"
          [viewDate]="viewDate()"
          [events]="eventList()"
          (createEventOutput)="createEvent($event)"></app-calendar>
      </div>
    }

    <dumb-contrat-list
      [title]="'Contrat(s) archivé(s)'"
      [contratEmployeList]="adminContratListArchived()"
      (archiveUnarchive)="archiveUnarchiveContrat($event)"
      [userApp]="currentUserApp()"></dumb-contrat-list>`,
  animations: [],
  standalone: true,
  imports: [ContratListDumb, CalendarDumb, DayLineDumb, CalendarNavDumb]
})
export class AdminContratsPage {
  selectedContrat: WritableSignal<ContratUserApp | undefined> =
    signal(undefined);
  viewDate: WritableSignal<Date> = signal(new Date());
  calendarViewDateChange(date: Date) {
    this.viewDate.set(date);
  }
  createEvent(event: CalendarEvent) {
    const selectedContrat = this.selectedContrat();
    if (selectedContrat) {
      this.adminServer.openCreateEventModal(event, selectedContrat.id + '');
    }
  }
  dayAppList = computed(() =>
    this.adminServer
      .dayAppList()
      .filter(
        (d) =>
          d.date.getTime() > subDays(this.viewDate(), 15).getTime() &&
          d.date.getTime() < addDays(this.viewDate(), 15).getTime()
      )
  );
  selectedDays = computed(() =>
    this.dayAppList().filter((d) =>
      isSameWeek(d.date, this.viewDate(), { locale: fr })
    )
  );
  eventList = this.adminServer.eventList;

  currentUserApp: WritableSignal<UserApp | undefined> = signal(undefined);
  idUserApp: WritableSignal<string | undefined> = signal(undefined);
  adminContratList = this.adminServer.adminContratList;
  adminContratListArchived = this.adminServer.adminContratListArchived;
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idUserApp = params.get('idUserApp');
      if (idUserApp) {
        this.idUserApp.set(idUserApp);
      }
    });
  }
  selectContrat(contrat: ContratUserApp | undefined) {
    this.selectedContrat.set(contrat);
  }
  archiveUnarchiveContrat(contrat: ContratUserApp) {
    this.adminServer.archiveUnarchiveContrat(contrat);
  }
  createContratModal(): void {
    const currentUserApp = this.currentUserApp();
    if (currentUserApp) {
      this.adminServer.createContratModal(currentUserApp);
    }
  }

  updateContratModal(contrat: ContratUserApp) {
    this.adminServer.updateContratModal(contrat);
  }

  constructor(
    private adminServer: AdminServerService,
    private route: ActivatedRoute
  ) {
    effect(
      () => {
        const idUserApp = this.idUserApp();
        const userAppList = this.adminServer.userAppList();
        if (idUserApp && userAppList.length > 0) {
          this.currentUserApp.set(
            userAppList.find((u) => u.id === Number(idUserApp))
          );
          this.adminServer.getContratListByUserId(idUserApp);
        }
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        this.adminServer.getCalendarDayAppListByContrat(this.selectedContrat());
      },
      { allowSignalWrites: true }
    );
    effect(
      () => {
        const viewDate = this.viewDate();
        const selectedContrat = this.selectedContrat();
        if (selectedContrat && selectedContrat.id) {
          this.adminServer.getAllEventByContratIdAndPeriod(
            startOfWeek(viewDate, { locale: fr }),
            endOfWeek(viewDate, { locale: fr }),
            selectedContrat.id + ''
          );
        }
      },
      { allowSignalWrites: true }
    );
  }
}
