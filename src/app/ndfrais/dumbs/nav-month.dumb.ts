import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContratUserApp } from 'src/app/models/contrat-employe.model';
import { DayApp } from 'src/app/models/day-app.model';
import { addMonths, endOfWeek, format, startOfWeek, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'dumb-nav-month',
  template: `
    <div class="headline py-1 px-2 flex justify-center items-center mt-3">
      <button mat-icon-button class="bigger-button"  (click)="previousMonth()">
        <mat-icon svgIcon="mat:arrow_back_ios"></mat-icon>
      </button>
      <div
        class="h-full flex items-center px-2 mx-2 items-center justify-center">
        <h2 class="h-full">{{ currentMonth }}</h2>
      </div>

      <button mat-icon-button class="bigger-button" (click)="nextMonth()">
        <mat-icon svgIcon="mat:arrow_forward_ios"></mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .bigger-button {
      padding: 1rem; /* ou 0.75rem */
    }
  
    @media (max-width: 640px) {
      .bigger-button {
        padding: 1.5rem; /* plus gros sur mobile */
      }
    }
  `],
  standalone: true,
  imports: [CommonModule, MatIconModule]
})
export class NavMonthDumb {
  _currentDate!: Date;
  currentMonth!: string;
  @Input() set currentDate(value: Date) {
    this._currentDate = value;
    this.currentMonth = format(value, 'MMM yyyy', { locale: fr });
  }
  get currentDate(): Date {
    return this._currentDate;
  }
  @Output() currentDateChange = new EventEmitter<Date>();

  previousMonth(): void {
    this.currentDateChange.emit(
      subMonths(startOfWeek(this.currentDate, { locale: fr }), 1)
    );
  }
  nextMonth(): void {
    this.currentDateChange.emit(
      addMonths(startOfWeek(this.currentDate, { locale: fr }), 1)
    );
  }
}
