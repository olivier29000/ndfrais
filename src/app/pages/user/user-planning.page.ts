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
import { MonthLineRecapDumb } from '../dumbs/month-line-recap.dumb';
@Component({
  template: `
    <div class="container">
      <dumb-month-line-recap
        [recapMonth]="recapMonth()"></dumb-month-line-recap>
      <dumb-calendar-nav
        [viewDate]="viewDate()"
        (viewDateOutput)="calendarViewDateChange($event)"></dumb-calendar-nav>
      <app-calendar
        [viewDate]="viewDate()"
        [events]="eventList()"></app-calendar>
    </div>
  `,
  styles: [``],
  standalone: true,
  imports: [CommonModule, CalendarDumb, MonthLineRecapDumb, CalendarNavDumb]
})
export class UserPlanningPage {
  constructor(
    private userServer: UserServerService,
    private route: ActivatedRoute
  ) {
    effect(
      () => {
        const viewDate = this.viewDate();
        this.userServer.getAllEventByContratIdAndPeriod(
          startOfWeek(viewDate, { locale: fr }),
          endOfWeek(viewDate, { locale: fr })
        );
        const idContrat = this.userServer.idContratUserApp();
        if (idContrat) {
          this.userServer.getRecapContrat(
            startOfWeek(viewDate, { locale: fr })
          );
        }
      },
      { allowSignalWrites: true }
    );
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idContrat = params.get('idContratUserApp');
      if (idContrat) {
        this.userServer.idContratUserApp.set(idContrat);
      }
    });
  }

  viewDate: WritableSignal<Date> = signal(new Date());
  calendarViewDateChange(date: Date) {
    this.viewDate.set(date);
  }
  eventList = this.userServer.eventList;

  recapMonth = this.userServer.recapMonth;
  selectedDays = computed(() =>
    this.recapMonth()?.dayAppList.filter((d) =>
      isSameWeek(d.date, this.viewDate(), { locale: fr })
    )
  );
}
