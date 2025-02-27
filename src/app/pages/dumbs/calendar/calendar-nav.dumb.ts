import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CalendarModule, CalendarView } from 'angular-calendar';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule
} from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
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
        @if (canCopyWeek) {
          <mat-datepicker-toggle
            [for]="datepickerRefdate"
            class="block"
            matIconPrefix
            matTooltip="Copier une semaine"></mat-datepicker-toggle>
          <input
            [matDatepicker]="datepickerRefdate"
            (dateChange)="copyWeek($event)"
            matInput
            style="visibility: hidden;"
            name="dateBegin" />
          <mat-datepicker #datepickerRefdate></mat-datepicker>
        }
      </div>
    </div>
  `,
  imports: [
    CommonModule,
    MatTooltipModule,
    MatDatepickerModule,
    CalendarModule,
    MatIconModule
  ]
})
export class CalendarNavDumb {
  CalendarView = CalendarView;
  view = CalendarView.Week;
  @Input() canCopyWeek = false;
  @Input() viewDate: Date = new Date();
  @Output() viewDateOutput = new EventEmitter<Date>();
  @Output() copyWeekDateOutput = new EventEmitter<Date>();

  constructor() {}

  copyWeek(event: MatDatepickerInputEvent<Date>) {
    const selectedDate: Date | null = event.value;
    if (selectedDate) this.copyWeekDateOutput.emit(selectedDate);
  }

  calendarViewDateChange(date: Date) {
    this.viewDateOutput.emit(date);
  }
}
