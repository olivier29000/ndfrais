import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'dumb-input-date-hour-minute',
  template: `
    <div class="flex flex-col sm:flex-row">
      <mat-form-field>
        <mat-label>Date de début</mat-label>
        <input
          [matDatepicker]="datepickerRefdateBegin"
          (ngModelChange)="dayChangeEmit($event)"
          [ngModel]="_day"
          matInput
          name="dateBegin" />
        <mat-datepicker-toggle
          [for]="datepickerRefdateBegin"
          class="block"
          matIconPrefix></mat-datepicker-toggle>
        <mat-datepicker #datepickerRefdateBegin></mat-datepicker>
      </mat-form-field>

      <mat-form-field>
        <mat-label>Heure</mat-label>
        <mat-select
          (ngModelChange)="hourChangeEmit($event)"
          [ngModel]="_hour"
          name="hour">
          @for (hour of hourList; track hour) {
            <mat-option [value]="hour">
              {{ hour }}
            </mat-option>
          }
        </mat-select>
      </mat-form-field>
      <mat-form-field>
        <mat-label>Minutes</mat-label>
        <mat-select
          (ngModelChange)="minuteChangeEmit($event)"
          [ngModel]="_minute"
          name="minute">
          @for (minute of minuteList; track minute) {
            <mat-option [value]="minute">
              {{ minute }}
            </mat-option>
          }
        </mat-select>
      </mat-form-field>
    </div>
  `,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule
  ]
})
export class InputDateHourMinuteDumb {
  hourList = Array.from({ length: 24 }, (_, i) => `${i < 10 ? '0' + i : i}`); // Liste des heures (0h - 23h)
  minuteList = ['00', '15', '30', '45'];
  _minute!: string;
  _hour!: string;
  _day!: Date;
  @Input()
  set date(value: Date | undefined) {
    if (value === undefined) {
      value = new Date();
    }
    this._day = value;
    this._hour = this.getHour(value);
    this._minute = this.getMinute(value);
  }
  @Output() dateChange = new EventEmitter<Date>();

  minuteChangeEmit(minute: string): void {
    let newDateTime = this._day.setHours(Number(this._hour));
    newDateTime = this._day.setMinutes(Number(minute));
    this.dateChange.emit(new Date(newDateTime));
  }
  hourChangeEmit(hour: string): void {
    let newDateTime = this._day.setHours(Number(hour));
    newDateTime = this._day.setMinutes(Number(this._minute));

    this.dateChange.emit(new Date(newDateTime));
  }

  dayChangeEmit(date: Date): void {
    this.dateChange.emit(date);
  }

  getHour(date: Date): string {
    return date.getHours() < 10 ? '0' + date.getHours() : date.getHours() + '';
  }
  getMinute(date: Date): string {
    if (date.getMinutes() < 15) {
      return '00';
    } else if (date.getMinutes() < 30) {
      return '15';
    } else if (date.getMinutes() < 45) {
      return '30';
    } else {
      return '45';
    }
  }
}
