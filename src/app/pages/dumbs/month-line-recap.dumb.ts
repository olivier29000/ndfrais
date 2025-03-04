import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContratUserApp } from 'src/app/models/contrat-employe.model';
import { DayApp } from 'src/app/models/day-app.model';
import { DayLineDumb } from './day-line.dumb';
@Component({
  selector: 'dumb-month-line-recap',
  template: `@for (recapMonth of recapMonthList; track recapMonth) {
    <div class="flex">
      <div class="card flex items-center mt-3 px-2" style="width:130px">
        <div class="flex-auto">
          <h4 class="body-2 m-0 leading-snug">
            {{ recapMonth.contrat.poste }}
          </h4>
          <h5 class="text-secondary m-0 caption leading-none">
            {{ recapMonth.contrat.userApp.nom }}
            {{ recapMonth.contrat.userApp.prenom }}
          </h5>

          <h4 class="body-2 m-0 leading-snug">
            Mois : {{ recapMonth.nbHours }}h
          </h4>
        </div>
      </div>
      <dumb-day-line
        (cancelLastOutput)="cancelLast($event)"
        (validLastOutput)="validLast($event)"
        [dayAppList]="recapMonth.dayAppList"
        [underlinedDayAppList]="selectedDays"></dumb-day-line>
    </div>
  } `,
  styles: [``],
  standalone: true,
  imports: [CommonModule, DayLineDumb]
})
export class MonthLineRecapDumb {
  @Input() recapMonthList!:
    | {
        dayAppList: DayApp[];
        contrat: ContratUserApp;
        nbHours: number;
      }[]
    | undefined;
  @Input() selectedDays: DayApp[] = [];
  @Output() cancelLastOutput = new EventEmitter<DayApp>();
  @Output() validLastOutput = new EventEmitter<DayApp>();
  cancelLast(day: DayApp): void {
    this.cancelLastOutput.emit(day);
  }
  validLast(day: DayApp): void {
    this.validLastOutput.emit(day);
  }
}
