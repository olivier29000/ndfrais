import { Component } from '@angular/core';
import { CalendarModule, CalendarView } from 'angular-calendar';
import { CommonModule } from '@angular/common';
import { AdminServerService } from '../services/admin-server.service';
import { MatIconModule } from '@angular/material/icon';
@Component({
  standalone: true,
  selector: 'smart-calendar-nav',
  template: `
    <div class="flex justify-center">
      <div class="flex items-center space-x-2">
        <!-- Bouton Précédent -->
        <button
          class="btn bg-gradient-to-r from-purple-400 to-pink-500 text-white px-4 py-2 rounded-md"
          mwlCalendarPreviousView
          [view]="view"
          [viewDate]="viewDate()"
          (viewDateChange)="calendarViewDateChange($event)">
          <mat-icon
            class="w-6 h-6 text-primary-500"
            svgIcon="mat:check"></mat-icon>
        </button>

        <!-- Bouton Aujourd'hui -->
        <button
          class="btn border border-gray-300 text-gray-700 px-6 py-2 rounded-md"
          mwlCalendarToday
          [viewDate]="viewDate()"
          (viewDateChange)="calendarViewDateChange($event)">
          <h4 class="text-lg font-semibold">
            {{ viewDate() | calendarDate: 'weekViewTitle' : 'fr' : 1 }}
          </h4>
        </button>

        <!-- Bouton Suivant -->
        <button
          class="btn bg-gradient-to-r from-purple-400 to-pink-500 text-white px-4 py-2 rounded-md"
          mwlCalendarNextView
          [view]="view"
          [viewDate]="viewDate()"
          (viewDateChange)="calendarViewDateChange($event)">
          <mat-icon
            class="w-6 h-6 text-primary-500"
            svgIcon="mat:check"></mat-icon>
        </button>
      </div>
    </div>
  `,
  imports: [CommonModule, CalendarModule, MatIconModule]
})
export class CalendarNavSmart {
  CalendarView = CalendarView;
  view = CalendarView.Week;
  viewDate = this.adminServer.calendarViewDate;

  constructor(private adminServer: AdminServerService) {}

  calendarViewDateChange(date: Date) {
    this.adminServer.calendarViewDateChange(date);
  }
}
