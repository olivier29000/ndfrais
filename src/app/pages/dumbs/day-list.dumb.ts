import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { eachDayOfInterval, eachMonthOfInterval, format } from 'date-fns';
import { DayApp } from 'src/app/models/day-app.model';
import { DaySquareDumb } from './day-square.dumb';
@Component({
  selector: 'dumb-day-list',
  template: `@for (item of dayAppMap | keyvalue; track $index) {
    <div class="me-3 d-flex my-3">
      <div class="border py-1 px-2">
        <h2>{{ item.key }}</h2>
      </div>

      @for (day of item.value; track day) {
        <dumb-day-state [day]="day"></dumb-day-state>
      }
    </div>
  }`,
  styles: [``],
  standalone: true,
  imports: [CommonModule, DaySquareDumb]
})
export class DayListDumb {
  @Input() dayAppMap!: {
    [month: string]: DayApp[];
  };
}
