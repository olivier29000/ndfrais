import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CalendarModule } from 'angular-calendar';
import { DayApp } from 'src/app/models/day-app.model';
import { DaySquareDumb } from '../day-square.dumb';

@Component({
  selector: 'dumb-days-calendar',
  template: `
    <div class="cal-day-headers cursor-default">
      @for (day of days; track $index) {
        <div
          class="cal-header"
          [class.cal-past]="day.isPast"
          [class.cal-future]="day.isFuture"
          [class.cal-drag-over]="day.dragOver"
          mwlDroppable
          (dragEnter)="day.dragOver = true"
          (dragLeave)="day.dragOver = false">
          <div class="top" [class.today]="day.isToday">
            @if (selectedDays && selectedDays.length > $index) {
              <div class="day-label" style="margin-bottom: 12px;">
                <dumb-day-state [day]="selectedDays[$index]"></dumb-day-state>
              </div>
            }
            <div class="day-label text-uppercase">
              {{ day.date | calendarDate: 'weekViewColumnHeader' : locale }}
            </div>
            <div class="day-number">
              {{ day.date | calendarDate: 'weekViewColumnSubHeader' : locale }}
            </div>
          </div>
        </div>
      }
    </div>
  `,
  standalone: true,
  imports: [CommonModule, CalendarModule, DaySquareDumb],
  styles: [
    `
      .cal-day-headers {
        position: sticky;
        top: 0;
        z-index: 10;
        background-color: white;
        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
      }
    `
  ]
})
export class DayCalendarDumb {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() days!: any[];
  @Input() locale!: string;
  @Input() selectedDays: DayApp[] = [];

  hovered = false;

  segmentHoverChange(value: boolean): void {
    this.hovered = value;
  }
}
