import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { CalendarModule, CalendarView } from 'angular-calendar';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule
} from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { DatepickerDumb } from '../datepicker.dumb';
@Component({
  standalone: true,
  selector: 'dumb-calendar-nav',
  template: `
    <div
      class="flex "
      [ngClass]="canCopyWeek ? 'justify-between' : 'justify-center'">
      @if (canCopyWeek) {
        <div></div>
      }
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
          class="flex btn border border-gray-300 text-gray-700 px-6 py-2 rounded-md"
          mwlCalendarToday
          [viewDate]="viewDate">
          <h4 class="text-lg font-semibold flex items-center">
            {{ viewDate | calendarDate: 'weekViewTitle' : 'fr' : 1 }}
          </h4>
          <dumb-datepicker
            (dateOutput)="calendarViewDateChange($event)"></dumb-datepicker>
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
      @if (canCopyWeek) {
        <dumb-datepicker
          class="mr-0"
          icon="history"
          (dateOutput)="copyWeek($event)"
          matTooltip="
          Copier/coller une semaine
        "></dumb-datepicker>
      }
    </div>
  `,
  imports: [
    CommonModule,
    MatTooltipModule,
    MatDatepickerModule,
    CalendarModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    DatepickerDumb
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' } // Définit lundi comme premier jour
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

  copyWeek(date: Date) {
    this.copyWeekDateOutput.emit(date);
  }

  calendarViewDateChange(date: Date) {
    this.viewDateOutput.emit(date);
  }
}
