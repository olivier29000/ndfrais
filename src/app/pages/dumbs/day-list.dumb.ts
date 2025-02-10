import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  EventEmitter,
  Input,
  Output,
  signal,
  WritableSignal
} from '@angular/core';
import {
  eachDayOfInterval,
  eachMonthOfInterval,
  format,
  isBefore,
  isSameDay,
  startOfDay
} from 'date-fns';
import { DayApp, WORK_STATE } from 'src/app/models/day-app.model';
import { DaySquareDumb } from './day-square.dumb';
@Component({
  selector: 'dumb-day-list',
  template: `@for (item of dayAppMap | keyvalue; track $index) {
    <div class="me-3 flex flex-wrap my-3 ">
      <div class="border py-1 px-2">
        <h2>{{ item.key }}</h2>
      </div>

      @for (day of item.value; track day) {
        <dumb-day-state
          [isLastSelected]="
            selectedDayList().length > 0 &&
            day.id === selectedDayList()[selectedDayList().length - 1].id
          "
          [isSelected]="isSelected(day)"
          [day]="day"
          (clickLast)="clickLast($event)"
          (clickDay)="selectDayApp(day)"
          (validPeriod)="validPeriodOutput()"
          (mouseenter)="selectableDayApp(day)"
          (mouseleave)="unselectableDayApp()"></dumb-day-state>
      }
    </div>
  }`,
  styles: [``],
  standalone: true,
  imports: [CommonModule, DaySquareDumb]
})
export class DayListDumb {
  constructor() {
    effect(() => this.selectDayList.emit(this.selectedDayList()), {
      allowSignalWrites: true
    });
  }
  dayAppMap!: {
    [month: string]: DayApp[];
  };

  selectedDayList: WritableSignal<DayApp[]> = signal([]);
  selectableDayList: DayApp[] = [];

  @Output() selectDayList = new EventEmitter<DayApp[]>();
  @Output() validPeriod = new EventEmitter<void>();

  @Input()
  set dayAppList(value: DayApp[]) {
    this.dayAppMap = value.reduce(
      (acc, d) => {
        if (acc[format(d.date, 'yyyy-MM')]) {
          acc[format(d.date, 'yyyy-MM')].push(d);
        } else {
          acc[format(d.date, 'yyyy-MM')] = [d];
        }
        return acc;
      },
      {} as { [month: string]: DayApp[] }
    );
  }

  validPeriodOutput(): void {
    this.validPeriod.emit();
    this.selectedDayList.set([]);
    this.selectableDayList = [];
  }

  isSelected(day: DayApp): boolean {
    return (
      this.selectedDayList().some((d) => d.id === day.id) ||
      this.selectableDayList.some((d) => d.id === day.id)
    );
  }
  selectableDayApp(day: DayApp): void {
    if (!day.actionDay) {
      if (this.selectedDayList().length === 0) {
        this.selectableDayList.push(day);
      } else if (
        isBefore(
          startOfDay(day.date),
          startOfDay(this.selectedDayList()[0].date)
        )
      ) {
        this.selectableDayList = [day];
      } else {
        const days = eachDayOfInterval({
          start: this.selectedDayList()[0].date,
          end: day.date
        });
        this.selectableDayList = [this.selectedDayList()[0]].concat(
          Object.values(this.dayAppMap)
            .flat()
            .filter((d) => d.workState === WORK_STATE.TRAVAIL && !d.actionDay)
            .filter((d) => days.some((da) => isSameDay(da, d.date)))
        );
      }
    }
  }
  unselectableDayApp(): void {
    this.selectableDayList = [];
  }

  selectDayApp(day: DayApp): void {
    if (!day.actionDay) {
      if (this.selectedDayList().length === 0) {
        this.selectedDayList.set([day]);
      } else if (
        isBefore(
          startOfDay(day.date),
          startOfDay(this.selectedDayList()[0].date)
        )
      ) {
        this.selectedDayList.set([day]);
      } else {
        const days = eachDayOfInterval({
          start: this.selectedDayList()[0].date,
          end: day.date
        });
        this.selectedDayList.set(
          [this.selectedDayList()[0]].concat(
            Object.values(this.dayAppMap)
              .flat()
              .filter((d) => d.workState === WORK_STATE.TRAVAIL && !d.actionDay)
              .filter((d) => days.some((da) => isSameDay(da, d.date)))
          )
        );
      }
    }
  }

  clickLast(day: DayApp): void {
    this.selectedDayList.set([]);
    this.selectableDayList = [day];
  }
}
