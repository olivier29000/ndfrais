import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContratUserApp } from 'src/app/models/contrat-employe.model';
import { DayApp } from 'src/app/models/day-app.model';
import { DayLineDumb } from './day-line.dumb';
import { addMonths, endOfWeek, format, startOfWeek, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'dumb-nav-month',
  template: `
    <div class="headline py-1 px-2 flex justify-center items-center">
      <button
        mat-icon-button
        (click)="previousMonth()"
        [disabled]="!canPreviousMonth">
        <mat-icon svgIcon="mat:arrow_back_ios"></mat-icon>
      </button>
      @for (month of currentMonthList; track $index) {
        <div class="card flex items-center mt-3 px-2 mx-2">
          <div class="flex-auto  items-center justify-center">
            <h2>{{ month }}</h2>
            @if (nbHeures && nbHeures.length > $index) {
              <h4 class="body-2 m-0 leading-snug items-center justify-center">
                Mois : {{ nbHeures[$index] }}h
              </h4>
            }
          </div>
        </div>
      }

      <button mat-icon-button (click)="nextMonth()" [disabled]="!canNextMonth">
        <mat-icon svgIcon="mat:arrow_forward_ios"></mat-icon>
      </button>
    </div>
  `,
  styles: [``],
  standalone: true,
  imports: [CommonModule, MatIconModule]
})
export class NavMonthDumb {
  canPreviousMonth!: boolean;
  canNextMonth!: boolean;
  _currentDate!: Date;
  currentMonthList!: string[];
  @Input() nbHeures!: number[];
  @Input() set currentDate(value: Date) {
    this._currentDate = value;
    this.currentMonthList = [
      ...new Set(
        [
          startOfWeek(value, { locale: fr }),
          endOfWeek(value, { locale: fr })
        ].map((d) => format(d, 'MMM yyyy', { locale: fr }))
      )
    ];
    this.getCanPreviousAndNextMonth();
  }
  get currentDate(): Date {
    return this._currentDate;
  }
  _currentContrat!: ContratUserApp | undefined;
  @Input() set currentContrat(value: ContratUserApp | undefined) {
    this._currentContrat = value;
    this.getCanPreviousAndNextMonth();
  }
  get currentContrat(): ContratUserApp | undefined {
    return this._currentContrat;
  }
  @Output() currentDateChange = new EventEmitter<Date>();

  previousMonth(): void {
    this.currentDateChange.emit(
      subMonths(startOfWeek(this.currentDate, { locale: fr }), 1)
    );
  }
  getCanPreviousAndNextMonth(): void {
    if (this.currentContrat && this.currentDate) {
      console.log('1');
      this.canPreviousMonth =
        subMonths(this.currentDate, 1).getTime() >
        this.currentContrat.dateBegin.getTime();
      this.canNextMonth =
        addMonths(this.currentDate, 1).getTime() <
        this.currentContrat.dateEnd.getTime();
    } else {
      console.log('2');
      this.canNextMonth = false;
      this.canPreviousMonth = false;
    }
    console.log('this.canPreviousMonth', this.canPreviousMonth);
    console.log('this.canNextMonth', this.canNextMonth);
  }
  nextMonth(): void {
    this.currentDateChange.emit(
      addMonths(startOfWeek(this.currentDate, { locale: fr }), 1)
    );
  }
}
