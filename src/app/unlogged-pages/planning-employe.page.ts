import {
  Component,
  computed,
  effect,
  Input,
  signal,
  WritableSignal
} from '@angular/core';
import { fr } from 'date-fns/locale';
import { ActivatedRoute } from '@angular/router';
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameWeek,
  startOfWeek,
  subMonths
} from 'date-fns';
import { CalendarEvent } from 'angular-calendar';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';
import { DayApp, WEEK_STATE, WORK_STATE } from 'src/app/models/day-app.model';
import { CalendarDumb } from '../pages/dumbs/calendar/calendar.dumb';
import { MonthLineRecapDumb } from '../pages/dumbs/month-line-recap.dumb';
import { CalendarNavDumb } from '../pages/dumbs/calendar/calendar-nav.dumb';
import { NavMonthDumb } from '../pages/dumbs/nav-month.dumb';
import { ContratUserApp } from '../models/contrat-employe.model';
import { UserApp } from '../models/user.model';
import { UnloggedServerService } from './unlogged-services/unlogged-server.service';

@Component({
  template: `
    <div class="container">
      <dumb-nav-month
        [currentDate]="viewDate()"
        [currentContrat]="selectedContrat()"
        [nbHeures]="nbHeures() ?? []"
        (currentDateChange)="calendarViewDateChange($event)"></dumb-nav-month>

      <dumb-month-line-recap
        [recapMonthList]="recapListCurrentContrat()"
        [selectedDays]="selectedDays() ?? []"
        (selectDayAppOutput)="selectDayApp($event)"></dumb-month-line-recap>
      <dumb-calendar-nav
        [viewDate]="viewDate()"
        [nbHours]="nbHoursWeek()"
        (viewDateOutput)="calendarViewDateChange($event)"></dumb-calendar-nav>
      <app-calendar
        [canCreate]="true"
        [viewDate]="viewDate()"
        [events]="eventList()"
        [selectedDays]="selectedDays() ?? []"></app-calendar>
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
export class PLanningEmployePage {
  viewDate = computed(() => {
    return this.unloggedServer.calendarViewDate();
  });

  selectDayApp(dayApp: DayApp): void {
    this.calendarViewDateChange(dayApp.date);
  }
  selectedContrat = this.unloggedServer.selectedContrat;
  calendarViewDateChange(date: Date) {
    const selectedContrat = this.unloggedServer.selectedContrat();
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
      this.unloggedServer.calendarViewDateChange(date);
    }
  }
  currentMonthRecap = computed(() =>
    format(this.viewDate(), 'MMMM yyyy', { locale: fr })
  );
  previousMonth(): void {
    const viewDate = startOfWeek(this.viewDate(), { locale: fr });
    this.calendarViewDateChange(subMonths(viewDate, 1));
  }
  canPreviousMonth = computed(() => {
    const selectedContrat = this.unloggedServer.selectedContrat();
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
    this.calendarViewDateChange(addMonths(viewDate, 1));
  }
  canNextMonth = computed(() => {
    const selectedContrat = this.unloggedServer.selectedContrat();
    if (selectedContrat) {
      return (
        addMonths(this.viewDate(), 1).getTime() <
        selectedContrat.dateEnd.getTime()
      );
    }
    return false;
  });
  recapListCurrentContrat = this.unloggedServer.recapListCurrentContrat;
  nbHeures = computed(() =>
    this.unloggedServer.recapListCurrentContrat()?.map((r) => r.nbHours)
  );
  selectedDays = computed(() => {
    const selectedDays = this.recapListCurrentContrat()
      ?.flatMap((recap) => recap.dayAppList)
      .filter((d) => isSameWeek(d.date, this.viewDate(), { locale: fr }));
    if (selectedDays?.length === 7) {
      return selectedDays;
    } else {
      const dayListWeek: DayApp[] = eachDayOfInterval({
        start: startOfWeek(this.viewDate(), { locale: fr }),
        end: endOfWeek(this.viewDate(), { locale: fr })
      }).map((day) => ({
        id: -1,
        date: day,
        weekState: WEEK_STATE.NORMAL,
        workState: WORK_STATE.HORS_CONTRAT
      }));
      return dayListWeek.reduce((acc, day) => {
        const d = (selectedDays ?? []).find(
          (sd) => sd.date.getDate() === day.date.getDate()
        );
        if (d) {
          acc.push(d);
        } else {
          acc.push(day);
        }
        return acc;
      }, [] as DayApp[]);
    }
  });
  nbHoursWeek = computed(() =>
    this.selectedDays().reduce((acc, day) => acc + (day.nbHours ?? 0), 0)
  );
  eventList = this.unloggedServer.eventList;

  currentUserApp: WritableSignal<UserApp | undefined> = signal(undefined);
  idUserApp: WritableSignal<string | undefined> = signal(undefined);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const tokenContrat = params.get('tokenContrat');
      if (tokenContrat) {
        this.unloggedServer.tokenContrat.set(tokenContrat);
      }
    });
  }

  constructor(
    private unloggedServer: UnloggedServerService,
    private route: ActivatedRoute
  ) {
    effect(
      () => {
        const viewDate = this.viewDate();

        const tokenContrat = this.unloggedServer.tokenContrat();
        if (tokenContrat) {
          this.unloggedServer.getAllEventBytokenContratAndPeriod(
            startOfWeek(viewDate, { locale: fr }),
            endOfWeek(viewDate, { locale: fr }),
            tokenContrat
          );
          this.unloggedServer.getRecapContratBytokenContrat(
            startOfWeek(viewDate, { locale: fr }),
            tokenContrat
          );
        }
      },
      { allowSignalWrites: true }
    );
  }
}
