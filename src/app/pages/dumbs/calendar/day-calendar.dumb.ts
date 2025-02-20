import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CalendarModule } from 'angular-calendar';

@Component({
  selector: 'dumb-days-calendar',
  template: `
    <div class="cal-day-headers cursor-default">
      <div
        class="cal-header"
        *ngFor="let day of days"
        [class.cal-past]="day.isPast"
        [class.cal-future]="day.isFuture"
        [class.cal-drag-over]="day.dragOver"
        mwlDroppable
        (dragEnter)="day.dragOver = true"
        (dragLeave)="day.dragOver = false">
        <div class="top" [class.today]="day.isToday">
          <div class="day-label text-uppercase">
            {{ day.date | calendarDate: 'weekViewColumnHeader' : locale }}
          </div>
          <div class="day-number">
            {{ day.date | calendarDate: 'weekViewColumnSubHeader' : locale }}
          </div>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, CalendarModule],
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
  hovered = false;

  segmentHoverChange(value: boolean): void {
    this.hovered = value;
  }
}
