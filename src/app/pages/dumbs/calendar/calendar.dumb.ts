import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CalendarModule, CalendarEvent } from 'angular-calendar';
import { CommonModule } from '@angular/common';
import { HourCalendarDumb } from './hour-calendar-dumb';
import { DayCalendarDumb } from './day-calendar.dumb';

@Component({
  standalone: true,
  selector: 'app-calendar',
  template: `
    <div class="calendar-container">
      <mwl-calendar-week-view
        [weekStartsOn]="1"
        [viewDate]="viewDate"
        [events]="events"
        (hourSegmentClicked)="createEvent($event)"
        [hourSegmentTemplate]="weekView"
        [headerTemplate]="dayHeaderTemplate">
      </mwl-calendar-week-view>
    </div>
    <ng-template
      #weekView
      let-segment="segment"
      let-locale="locale"
      let-isTimeLabel="isTimeLabel">
      <dumb-hour-calendar
        [isTimeLabel]="isTimeLabel"
        [locale]="'fr'"
        [segment]="segment"></dumb-hour-calendar>
    </ng-template>
    <ng-template
      #dayHeaderTemplate
      let-days="days"
      let-locale="locale"
      let-dayClicked="dayClicked"
      let-eventDropped="eventDropped">
      <dumb-days-calendar [days]="days" [locale]="'fr'"></dumb-days-calendar>
    </ng-template>
  `,
  imports: [CommonModule, CalendarModule, HourCalendarDumb, DayCalendarDumb]
})
export class CalendarDumb {
  @Input() viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  @Output() createEventOutput = new EventEmitter<Date>();

  createEvent({ date }: { date: Date }): void {
    this.createEventOutput.emit(date);
  }
}
