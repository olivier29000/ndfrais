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
  parse,
  startOfDay
} from 'date-fns';
import { DayApp, WORK_STATE } from 'src/app/models/day-app.model';
import { DaySquareDumb } from './day-square.dumb';
import { fr } from 'date-fns/esm/locale';
@Component({
  selector: 'dumb-day-list',

  template: ` @for (item of dayAppByMonth; track $index) {
    <div
      class="my-1 container flex flex-col sm:flex-row items-stretch sm:items-start gap-6">
      <div class="card p-6 flex-auto">
        <div class="headline py-1 px-2 flex justify-center items-center">
          <h2>{{ item.month }}</h2>
        </div>
        <div class="me-3 flex flex-wrap my-3 ">
          @for (day of item.dayAppList; track day) {
            <dumb-day-state
              [isLastSelected]="
                selectedDayList().length > 0 &&
                day.id === selectedDayList()[selectedDayList().length - 1].id
              "
              [selectedWorkstate]="selectedWorkstate"
              [isSelected]="isSelected(day)"
              [day]="day"
              (clickLast)="clickLast($event)"
              (clickDay)="selectDayApp(day)"
              (validPeriod)="validPeriodOutput()"
              (mouseenter)="selectableDayApp(day)"
              (mouseleave)="unselectableDayApp()"></dumb-day-state>
          }
        </div>
      </div>
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
  dayAppByMonth!: {
    month: string;
    dayAppList: DayApp[];
  }[];

  selectedDayList: WritableSignal<DayApp[]> = signal([]);
  selectableDayList: DayApp[] = [];

  @Input() selectedWorkstate!: string;

  @Output() selectDayList = new EventEmitter<DayApp[]>();
  @Output() validPeriod = new EventEmitter<void>();

  @Input()
  set dayAppList(value: DayApp[]) {
    this.dayAppByMonth = Object.entries(
      value.reduce(
        (acc, d) => {
          if (acc[format(d.date, 'MMMM yyyy', { locale: fr })]) {
            acc[format(d.date, 'MMMM yyyy', { locale: fr })].push(d);
          } else {
            acc[format(d.date, 'MMMM yyyy', { locale: fr })] = [d];
          }
          return acc;
        },
        {} as { [month: string]: DayApp[] }
      )
    )
      .map(([key, value]) => ({
        month: key,
        dayAppList: value
      }))
      .sort(
        (a, b) =>
          parse(a.month, 'MMMM yyyy', new Date(), { locale: fr }).getTime() -
          parse(b.month, 'MMMM yyyy', new Date(), { locale: fr }).getTime()
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
          this.dayAppByMonth
            .map((dbm) => dbm.dayAppList)
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
            this.dayAppByMonth
              .map((dbm) => dbm.dayAppList)
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
