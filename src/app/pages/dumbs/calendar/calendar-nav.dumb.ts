import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CalendarModule, CalendarView } from 'angular-calendar';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
@Component({
  standalone: true,
  selector: 'dumb-calendar-nav',
  template: `
    <div class="flex justify-center">
      <div class="flex items-center space-x-2">
        <!-- Bouton Précédent -->
        <button
          class="btn bg-gradient-to-r text-white px-4 py-2 rounded-md"
          mwlCalendarPreviousView
          [view]="view"
          [viewDate]="viewDate"
          (viewDateChange)="calendarViewDateChange($event)">
          <mat-icon
            class="w-6 h-6 text-primary-500"
            svgIcon="mat:keyboard_arrow_left"></mat-icon>
        </button>

        <!-- Bouton Aujourd'hui -->
        <button
          class="btn border border-gray-300 text-gray-700 px-6 py-2 rounded-md"
          mwlCalendarToday
          [viewDate]="viewDate"
          (viewDateChange)="calendarViewDateChange($event)">
          <h4 class="text-lg font-semibold">
            {{ viewDate | calendarDate: 'weekViewTitle' : 'fr' : 1 }}
          </h4>
        </button>

        <!-- Bouton Suivant -->
        <button
          class="btn bg-gradient-to-r text-white px-4 py-2 rounded-md"
          mwlCalendarNextView
          [view]="view"
          [viewDate]="viewDate"
          (viewDateChange)="calendarViewDateChange($event)">
          <mat-icon
            class="w-6 h-6 text-primary-500"
            svgIcon="mat:keyboard_arrow_right"></mat-icon>
        </button>
      </div>
    </div>
  `,
  imports: [CommonModule, CalendarModule, MatIconModule]
})
export class CalendarNavDumb {
  CalendarView = CalendarView;
  view = CalendarView.Week;
  @Input() viewDate: Date = new Date();
  @Output() viewDateOutput = new EventEmitter<Date>();

  constructor() {}

  calendarViewDateChange(date: Date) {
    this.viewDateOutput.emit(date);
  }
}
