import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  signal,
  WritableSignal
} from '@angular/core';
import { UserServerService } from './services/user-server.service';
import { addDays, endOfWeek, isSameWeek, startOfWeek, subDays } from 'date-fns';
import { CalendarDumb } from '../dumbs/calendar/calendar.dumb';
import { DayLineDumb } from '../dumbs/day-line.dumb';
import { CalendarNavDumb } from '../dumbs/calendar/calendar-nav.dumb';
import { ActivatedRoute } from '@angular/router';
import { fr } from 'date-fns/locale';
@Component({
  template: `
    @if (dayAppList().length > 0) {
      <div class="container">
        <dumb-day-line
          [dayAppList]="dayAppList()"
          [borderedDayAppList]="selectedDays()"></dumb-day-line>
        <dumb-calendar-nav
          [viewDate]="viewDate()"
          (viewDateOutput)="calendarViewDateChange($event)"></dumb-calendar-nav>
        <app-calendar
          [viewDate]="viewDate()"
          [events]="eventList()"></app-calendar>
      </div>
    }
  `,
  styles: [``],
  standalone: true,
  imports: [CommonModule, CalendarDumb, DayLineDumb, CalendarNavDumb]
})
export class UserPlanningPage {
  constructor(
    private userServer: UserServerService,
    private route: ActivatedRoute
  ) {
    effect(
      () => {
        const viewDate = this.viewDate();
        const idContrat = this.idContrat();
        if (idContrat) {
          this.userServer.getAllEventByContratIdAndPeriod(
            startOfWeek(viewDate, { locale: fr }),
            endOfWeek(viewDate, { locale: fr }),
            idContrat
          );
        }
      },
      { allowSignalWrites: true }
    );
  }
  idContrat: WritableSignal<string | undefined> = signal(undefined);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idContrat = params.get('idContratUserApp');
      if (idContrat) {
        this.idContrat.set(idContrat);
      }
    });
  }

  viewDate: WritableSignal<Date> = signal(new Date());
  calendarViewDateChange(date: Date) {
    this.viewDate.set(date);
  }
  eventList = this.userServer.eventList;

  dayAppList = computed(() =>
    this.userServer
      .userDayAppList()
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
}
