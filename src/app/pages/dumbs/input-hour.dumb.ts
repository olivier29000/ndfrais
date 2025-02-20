import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'dumb-input-hour',
  template: `
    <input
      class="form-control"
      type="time"
      (ngModelChange)="hourChangeEmit($event)"
      [ngModel]="_hour"
      name="timeEndNewEvent" />
  `,
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class InputHourDumb {
  _hour!: string;
  _date!: string;
  @Input()
  set hour(value: Date | undefined) {
    if (value === undefined) {
      value = new Date();
    }
    this._date = this.dateToInputFormat(value);
    this._hour = this.getTimeHour(value);
  }
  @Output() hourChange = new EventEmitter<Date>();

  hourChangeEmit(hour: string): void {
    this.hourChange.emit(this.getDateFromString(this._date, hour));
  }

  getTimeHour(date: Date): string {
    return (
      (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +
      ':' +
      (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    );
  }

  dateToInputFormat(date?: Date): string {
    return date ? date.toISOString().split('T')[0] : '';
  }

  getDateFromString(startDate: string, startTime: string): Date {
    const date = new Date(startDate);
    const [hoursStart, minutesStart] = startTime.split(':').map(Number);
    date.setHours(hoursStart);
    date.setMinutes(minutesStart);
    return date;
  }
}
