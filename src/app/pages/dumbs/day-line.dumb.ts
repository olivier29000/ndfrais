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
import { Action, ActionDay } from 'src/app/models/action.model';
@Component({
  selector: 'dumb-day-line',

  template: `
    <div class="me-3 flex flex-wrap my-3 ">
      @for (day of dayAppList; track day) {
        <dumb-day-state
          [isLastSelected]="day.isLastSelected ?? false"
          [selectedWorkstate]="
            day.isSelected && day.actionDay ? day.actionDay.workState : ''
          "
          [isSelected]="day.isSelected ?? false"
          [day]="day"
          (clickDay)="selectDayApp(day)"
          (clickLast)="cancelLast($event)"
          (validPeriod)="validLast(day)"
          (mouseenter)="mouseenterDayApp(day)"
          (mouseleave)="mouseleaveDayApp(day)"></dumb-day-state>
      }
    </div>
  `,
  styles: [``],
  standalone: true,
  imports: [CommonModule, DaySquareDumb]
})
export class DayLineDumb {
  constructor() {}
  _actionList: ActionDay[] = [];
  _dayAppList!: (DayApp & {
    isSelected?: boolean;
    isLastSelected?: boolean;
  })[];
  @Input()
  set dayAppList(value: DayApp[]) {
    const dayActionList = value.reduce(
      (acc, dayApp) => {
        if (!dayApp.actionDay) {
          return acc;
        } else {
          console.log(dayApp.actionDay);
          const data = acc.find(
            (a) => a.idAction === dayApp.actionDay?.idAction
          );
          console.log(data);
          if (data) {
            data.idDayAppList.push(dayApp.id);
          } else {
            acc.push({ ...dayApp.actionDay, idDayAppList: [dayApp.id] });
          }

          return acc;
        }
      },
      [] as (ActionDay & {
        idDayAppList: number[];
      })[]
    );
    console.log(dayActionList);
    this._dayAppList = value.map((dayApp) => {
      const action = dayActionList.find(
        (a) => a.idAction === dayApp.actionDay?.idAction
      );
      if (action) {
        return {
          ...dayApp,
          isSelected: true,
          isLastSelected:
            action.idDayAppList[action.idDayAppList.length - 1] === dayApp.id
        };
      } else {
        return dayApp;
      }
    });
    console.log(this._dayAppList);
  }

  get dayAppList(): (DayApp & {
    isSelected?: boolean;
    isLastSelected?: boolean;
  })[] {
    return this._dayAppList;
  }

  @Input() selectedWorkstate!: string;

  @Output() selectDayAppOutput = new EventEmitter<DayApp>();
  @Output() cancelLastOutput = new EventEmitter<DayApp>();
  @Output() validLastOutput = new EventEmitter<DayApp>();
  @Output() mouseenterDayAppOutput = new EventEmitter<DayApp>();
  @Output() mouseleaveDayAppOutput = new EventEmitter<DayApp>();

  selectDayApp(day: DayApp): void {
    this.selectDayAppOutput.emit(day);
  }
  cancelLast(day: DayApp): void {
    this.cancelLastOutput.emit(day);
  }
  validLast(day: DayApp): void {
    this.validLastOutput.emit(day);
  }
  mouseenterDayApp(day: DayApp): void {
    this.mouseenterDayAppOutput.emit(day);
  }
  mouseleaveDayApp(day: DayApp): void {
    this.mouseleaveDayAppOutput.emit(day);
  }
}
