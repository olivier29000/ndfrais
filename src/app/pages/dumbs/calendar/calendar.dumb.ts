import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CalendarModule, CalendarEvent } from 'angular-calendar';
import { CommonModule } from '@angular/common';
import { HourCalendarDumb } from './hour-calendar-dumb';
import { DayCalendarDumb } from './day-calendar.dumb';
import { subMinutes } from 'date-fns';

@Component({
  standalone: true,
  selector: 'app-calendar',
  template: `
    <div class="calendar-container">
      <mwl-calendar-week-view
        [weekStartsOn]="1"
        [viewDate]="viewDate"
        [events]="eventsWithNew"
        [hourSegmentTemplate]="weekView"
        [eventTemplate]="customEvent"
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
        [segment]="segment"
        (mousedown)="onMouseDown(segment.date)"
        (mouseup)="onMouseUp(segment.date)"
        (mouseover)="onMouseOver(segment.date)"></dumb-hour-calendar>
    </ng-template>
    <ng-template
      #dayHeaderTemplate
      let-days="days"
      let-locale="locale"
      let-dayClicked="dayClicked"
      let-eventDropped="eventDropped">
      <dumb-days-calendar [days]="days" [locale]="'fr'"></dumb-days-calendar>
    </ng-template>
    <ng-template #customEvent let-weekEvent="weekEvent">
      <div
        class="custom-event overflow-auto  flex flex-column"
        [ngClass]="weekEvent.event.avaibility ? 'event-avaibility' : ''"
        [style.height]="weekEvent.height + 'px'"
        [style.cursor]="weekEvent.event.id ? 'grab' : 'default'"
        [style.border]="
          '3px solid ' +
          convertHexToRgba(weekEvent.event.color?.primary || '#000000', 1)
        "
        [style.backgroundColor]="
          convertHexToRgba(weekEvent.event.color?.primary || '#000000', 0.1)
        "
        (mouseup)="eventMouseUp()"
        (mouseover)="eventOver()">
        <div class="text-center mt-1">
          <b>{{ weekEvent.event.title }}</b>
        </div>
      </div>
    </ng-template>
  `,
  imports: [CommonModule, CalendarModule, HourCalendarDumb, DayCalendarDumb],
  styles: [
    `
      .custom-event {
        background-color: blue;
      }
    `
  ]
})
export class CalendarDumb {
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

  @Input() canCreate = false;
  @Input() viewDate: Date = new Date();
  _events: CalendarEvent[] = [];
  @Input()
  set events(value: CalendarEvent[]) {
    console.log(value);
    this.eventsWithNew = value;
    this._events = value;
  }

  get events(): CalendarEvent[] {
    return this._events;
  }
  @Output() createEventOutput = new EventEmitter<CalendarEvent>();
  eventsWithNew: CalendarEvent[] = this.events;

  newEvent: CalendarEvent | undefined = undefined;
  onMouseDown(date: Date) {
    if (this.canCreate) {
      this.newEvent = {
        title: '',
        start: date,
        end: date,
        color: { primary: '#111827', secondary: '#111827' }
      };
      this.eventsWithNew = this.events.concat([this.newEvent]);
    }
  }
  eventMouseUp() {
    if (this.canCreate) {
      if (this.newEvent) {
        this.createEventOutput.emit(this.newEvent);
      }
      this.newEvent = undefined;
      this.eventsWithNew = this.events;
    }
  }
  eventOver() {
    if (this.canCreate) {
      if (this.newEvent && this.newEvent.end) {
        this.newEvent = {
          ...this.newEvent,
          end: subMinutes(this.newEvent.end, 30)
        };
        this.eventsWithNew = this.events.concat([this.newEvent]);
      }
    }
  }
  onMouseOver(date: Date) {
    if (this.canCreate && this.newEvent) {
      this.newEvent = {
        ...this.newEvent,
        end: date
      };
      this.eventsWithNew = this.events.concat([this.newEvent]);
    }
  }

  onMouseUp(date: Date) {
    if (this.canCreate) {
      if (this.newEvent) {
        this.createEventOutput.emit({
          ...this.newEvent,
          end: date
        });
      }
      this.newEvent = undefined;
      this.eventsWithNew = this.events;
    }
  }
}
