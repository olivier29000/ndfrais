import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { CalendarModule, CalendarEvent } from 'angular-calendar';
import { CommonModule } from '@angular/common';
import { HourCalendarDumb } from './hour-calendar-dumb';
import { DayCalendarDumb } from './day-calendar.dumb';
import { subMinutes } from 'date-fns';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EventMeta } from '../../../models/meta-event.model';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DayApp } from 'src/app/models/day-app.model';

@Component({
  standalone: true,
  selector: 'app-calendar',
  template: `
    <div class="horizontal-scroll calendar-container">
      <div #calendarContainer class="calendar">
        <mwl-calendar-week-view
          [weekStartsOn]="1"
          [viewDate]="viewDate"
          [events]="eventsWithNew"
          [hourSegmentTemplate]="weekView"
          [eventTemplate]="customEvent"
          [headerTemplate]="dayHeaderTemplate">
        </mwl-calendar-week-view>
      </div>
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
      <dumb-days-calendar
        [days]="days"
        [locale]="'fr'"
        [selectedDays]="selectedDays"></dumb-days-calendar>
    </ng-template>
    <ng-template #customEvent let-weekEvent="weekEvent">
      <div
        [matTooltip]="
          weekEvent.event.meta && weekEvent.event.meta.contratUserApp
            ? weekEvent.event.meta.contratUserApp.userApp.pseudo +
              ' - ' +
              weekEvent.event.meta.contratUserApp.poste
            : ''
        "
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
        <div class="text-center mt-1 w-full">
          @if (weekEvent.event.meta && weekEvent.event.meta.contratUserApp) {
            <b>{{ weekEvent.event.meta.contratUserApp.userApp.pseudo }}</b>
            <br />
            <b>{{ weekEvent.event.meta.contratUserApp.poste }}</b>
          }
        </div>
        @if (canCreate) {
          <div class="mt-auto flex content-center mb-1 w-full">
            <button
              mat-icon-button
              (click)="deleteEvent(weekEvent.event)"
              class="mx-auto">
              <mat-icon svgIcon="mat:restore_from_trash"></mat-icon>
            </button>
          </div>
        }
      </div>
    </ng-template>
  `,
  imports: [
    CommonModule,
    CalendarModule,
    HourCalendarDumb,
    DayCalendarDumb,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  styles: [
    `
      .horizontal-scroll {
        width: 95%; /* largeur du conteneur visible */
        white-space: nowrap; /* Empêche le contenu de passer à la ligne */
        overflow-x: auto; /* Ajoute une barre de défilement horizontale si nécessaire */
        border: 1px solid #ccc; /* Juste pour visualiser */
      }

      .cal-day-headers {
        position: sticky;
        top: 0;
        z-index: 10;
        background-color: white;
        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
      }
      .calendar {
        height: 70vh;
        overflow: scroll;
        min-width: 800px;
      }

      h3 {
        margin: 0 0 10px;
      }

      pre {
        background-color: #f5f5f5;
        padding: 15px;
      }
    `
  ]
})
export class CalendarDumb {
  @ViewChild('calendarContainer', { static: true })
  calendarContainer!: ElementRef<HTMLDivElement>;
  ngAfterViewInit(): void {
    // Positionner le scroll au milieu
    const calendarElement = this.calendarContainer.nativeElement;

    if (calendarElement) {
      // Calculer la moitié de la hauteur
      const scrollMiddle = calendarElement.scrollHeight / 3;
      calendarElement.scrollTop = scrollMiddle; // Positionner le scroll
    }
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
  @Input() selectedDays!: DayApp[];
  @Input() canCreate = false;
  @Input() viewDate: Date = new Date();
  _events: CalendarEvent<EventMeta>[] = [];
  @Input()
  set events(value: CalendarEvent<EventMeta>[]) {
    this.eventsWithNew = value;
    this._events = value;
  }

  get events(): CalendarEvent[] {
    return this._events;
  }
  @Output() createEventOutput = new EventEmitter<CalendarEvent>();
  @Output() deleteEventOutput = new EventEmitter<CalendarEvent>();

  deleteEvent(event: CalendarEvent) {
    this.deleteEventOutput.emit(event);
  }

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
