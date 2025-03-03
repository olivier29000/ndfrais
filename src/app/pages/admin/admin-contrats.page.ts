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
import {
  addDays,
  addMonths,
  endOfWeek,
  format,
  isSameWeek,
  startOfWeek,
  subDays,
  subMonths
} from 'date-fns';
import { CalendarNavDumb } from '../dumbs/calendar/calendar-nav.dumb';
import { CalendarEvent } from 'angular-calendar';
import { MonthLineRecapDumb } from '../dumbs/month-line-recap.dumb';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';

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
    @if (selectedContrat()) {
      <div class="container">
        <div class="headline py-1 px-2 flex justify-center items-center">
          <button
            mat-icon-button
            (click)="previousMonth()"
            [disabled]="!canPreviousMonth()">
            <mat-icon svgIcon="mat:arrow_back_ios"></mat-icon>
          </button>
          <h2>{{ currentMonthRecap() }}</h2>

          <button
            mat-icon-button
            (click)="nextMonth()"
            [disabled]="!canNextMonth()">
            <mat-icon svgIcon="mat:arrow_forward_ios"></mat-icon>
          </button>
        </div>
        <dumb-month-line-recap
          [recapMonth]="recapCurrentContrat()"></dumb-month-line-recap>
        <dumb-calendar-nav
          [viewDate]="viewDate()"
          [canCopyWeek]="true"
          (viewDateOutput)="calendarViewDateChange($event)"
          (copyWeekDateOutput)="copyPasteWeek($event)"></dumb-calendar-nav>
        <app-calendar
          [canCreate]="true"
          [viewDate]="viewDate()"
          [events]="eventList()"
          (createEventOutput)="createEvent($event)"
          (deleteEventOutput)="deleteEvent($event)"></app-calendar>
      </div>
    }

    <dumb-contrat-list
      [title]="'Contrat(s) archivé(s)'"
      [contratEmployeList]="adminContratListArchived()"
      (archiveUnarchive)="archiveUnarchiveContrat($event)"
      [userApp]="currentUserApp()"></dumb-contrat-list>`,
  animations: [],
  standalone: true,
  imports: [
    ContratListDumb,
    MatIconModule,
    CalendarDumb,
    MonthLineRecapDumb,
    CalendarNavDumb
  ]
})
export class AdminContratsPage {
  selectedContrat: WritableSignal<ContratUserApp | undefined> =
    signal(undefined);
  viewDate: WritableSignal<Date> = signal(
    startOfWeek(new Date(), { locale: fr })
  );
  calendarViewDateChange(date: Date) {
    const selectedContrat = this.selectedContrat();
    if (
      selectedContrat &&
      (endOfWeek(date, { locale: fr }).getTime() <
        selectedContrat.dateBegin.getTime() ||
        startOfWeek(date, { locale: fr }).getTime() >
          selectedContrat.dateEnd.getTime())
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Vous ne pouvez pas aller sur des dates hors contrat'
      });
    } else {
      this.viewDate.set(date);
    }
  }
  currentMonthRecap = computed(() =>
    format(this.viewDate(), 'MMMM yyyy', { locale: fr })
  );
  copyPasteWeek(date: Date): void {
    const selectedContrat = this.selectedContrat();
    if (selectedContrat) {
      this.adminServer.copyPasteWeek(
        date,
        this.viewDate(),
        selectedContrat.id + ''
      );
    }
  }
  previousMonth(): void {
    const viewDate = startOfWeek(this.viewDate(), { locale: fr });
    this.viewDate.set(subMonths(viewDate, 1));
  }
  canPreviousMonth = computed(() => {
    const selectedContrat = this.selectedContrat();
    if (selectedContrat) {
      return (
        subMonths(this.viewDate(), 1).getTime() >
        selectedContrat.dateBegin.getTime()
      );
    }
    return false;
  });
  nextMonth(): void {
    const viewDate = startOfWeek(this.viewDate(), { locale: fr });
    this.viewDate.set(addMonths(viewDate, 1));
  }
  canNextMonth = computed(() => {
    const selectedContrat = this.selectedContrat();
    if (selectedContrat) {
      return (
        addMonths(this.viewDate(), 1).getTime() <
        selectedContrat.dateEnd.getTime()
      );
    }
    return false;
  });
  createEvent(event: CalendarEvent) {
    const selectedContrat = this.selectedContrat();
    if (selectedContrat) {
      this.adminServer.openCreateEventModal(event, selectedContrat.id + '');
    }
  }
  deleteEvent(event: CalendarEvent) {
    const selectedContrat = this.selectedContrat();
    if (selectedContrat) {
      this.adminServer.deleteEvent(event, selectedContrat.id + '');
    }
  }
  recapCurrentContrat = this.adminServer.recapCurrentContrat;
  selectedDays = computed(() =>
    this.recapCurrentContrat()?.dayAppList.filter((d) =>
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
        this.selectedContrat.set(undefined);
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

        const idContrat = this.selectedContrat()?.id;
        if (idContrat) {
          this.adminServer.getAllEventByContratIdAndPeriod(
            startOfWeek(viewDate, { locale: fr }),
            endOfWeek(viewDate, { locale: fr }),
            idContrat + ''
          );
          this.adminServer.getRecapContrat(
            startOfWeek(viewDate, { locale: fr }),
            idContrat
          );
        }
      },
      { allowSignalWrites: true }
    );
  }
}
