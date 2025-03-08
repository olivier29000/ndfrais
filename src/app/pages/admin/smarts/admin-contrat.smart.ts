import {
  Component,
  computed,
  effect,
  Input,
  signal,
  WritableSignal
} from '@angular/core';
import { fr } from 'date-fns/locale';
import { UserApp } from '../../../models/user.model';
import { ActivatedRoute } from '@angular/router';
import { ContratListDumb } from '../../dumbs/contrat-list.dumb';
import { ContratUserApp } from '../../../models/contrat-employe.model';
import { AdminServerService } from '../services/admin-server.service';
import { CalendarDumb } from '../../dumbs/calendar/calendar.dumb';
import { DayLineDumb } from '../../dumbs/day-line.dumb';
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
import { CalendarNavDumb } from '../../dumbs/calendar/calendar-nav.dumb';
import { CalendarEvent } from 'angular-calendar';
import { MonthLineRecapDumb } from '../../dumbs/month-line-recap.dumb';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';
import { NavMonthDumb } from '../../dumbs/nav-month.dumb';

@Component({
  selector: 'smart-admin-contrat',
  template: `
    <div class="container">
      <dumb-nav-month
        [currentDate]="viewDate()"
        [currentContrat]="selectedContrat()"
        [nbHeures]="nbHeures() ?? []"
        (currentDateChange)="calendarViewDateChange($event)"></dumb-nav-month>

      <dumb-month-line-recap
        [recapMonthList]="recapListCurrentContrat()"
        [selectedDays]="selectedDays() ?? []"></dumb-month-line-recap>
      <dumb-calendar-nav
        [viewDate]="viewDate()"
        [canCopyWeek]="true"
        (viewDateOutput)="calendarViewDateChange($event)"
        (copyWeekDateOutput)="copyPasteWeek($event)"></dumb-calendar-nav>
      <app-calendar
        [canCreate]="true"
        [viewDate]="viewDate()"
        [events]="eventList()"
        [selectedDays]="selectedDays() ?? []"
        (createEventOutput)="createEvent($event)"
        (deleteEventOutput)="deleteEvent($event)"></app-calendar>
    </div>
  `,
  animations: [],
  standalone: true,
  imports: [
    MatIconModule,
    CalendarDumb,
    MonthLineRecapDumb,
    CalendarNavDumb,
    NavMonthDumb
  ]
})
export class AdminContratSmart {
  @Input() set currentContrat(value: ContratUserApp | undefined) {
    console.log(value);
    this.selectedContrat.set(value);
  }
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
  recapListCurrentContrat = this.adminServer.recapListCurrentContrat;
  nbHeures = computed(() =>
    this.adminServer.recapListCurrentContrat()?.map((r) => r.nbHours)
  );
  selectedDays = computed(() =>
    this.recapListCurrentContrat()
      ?.flatMap((recap) => recap.dayAppList)
      .filter((d) => isSameWeek(d.date, this.viewDate(), { locale: fr }))
  );
  eventList = this.adminServer.eventList;

  currentUserApp: WritableSignal<UserApp | undefined> = signal(undefined);
  idUserApp: WritableSignal<string | undefined> = signal(undefined);
  adminContratList = this.adminServer.adminContratList;
  adminContratListArchived = this.adminServer.adminContratListArchived;

  selectContrat(contrat: ContratUserApp | undefined) {
    this.selectedContrat.set(contrat);
  }
  archiveUnarchiveContrat(contrat: ContratUserApp) {
    this.adminServer.archiveUnarchiveContrat(contrat);
  }

  constructor(
    private adminServer: AdminServerService,
    private route: ActivatedRoute
  ) {
    effect(
      () => {
        console.log('1');
        this.adminServer.getCalendarDayAppListByContrat(this.selectedContrat());
      },
      { allowSignalWrites: true }
    );
    effect(
      () => {
        console.log('2');
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
