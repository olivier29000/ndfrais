import { CommonModule, registerLocaleData } from '@angular/common';
import {
  Component,
  EventEmitter,
  Injectable,
  Input,
  Output
} from '@angular/core';
import {
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatDateFormats
} from '@angular/material/core';
import { DayApp, WORK_STATE } from 'src/app/models/day-app.model';
import localeFr from '@angular/common/locales/fr';
import { MatIconModule } from '@angular/material/icon';
import { scaleInOutAnimation } from '@vex/animations/scale-in-out.animation';
@Injectable()
export class CustomDateFormats {
  static readonly MY_DATE_FORMATS: MatDateFormats = {
    parse: {
      dateInput: 'DD/MM/YYYY'
    },
    display: {
      dateInput: 'dd/MM/yyyy',
      monthYearLabel: 'MMMM yyyy',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM yyyy'
    }
  };
}

@Component({
  selector: 'dumb-day-state',
  template: `
    <div class="card day-square  mt-1">
      <div class="day-state" [ngClass]="day.weekState"></div>
      <div
        class="work-state"
        [ngClass]="isSelected ? 'bg-grey' : day.workState"
        (click)="clickDayOutput(day)"></div>
      <div class="day-text text-center" (click)="clickDayOutput(day)">
        <h2 class="">{{ day.date.getDate() }}</h2>
        <p>{{ day.date | date: 'EEE' : '' : 'fr' | slice: 0 : 2 }}</p>
      </div>
      @if (isLastSelected) {
        <button
          @scaleInOut
          class="absolute -top-3 -right-1 bg-foreground shadow-xl hover:shadow-lg bg-grey"
          color="primary"
          mat-icon-button
          type="button"
          (click)="clickLastOutput(day)">
          <mat-icon svgIcon="mat:highlight_off"></mat-icon>
        </button>
      } @else if (day.actionDay) {
        <button
          @scaleInOut
          class="absolute -top-3 -right-1 bg-foreground shadow-xl hover:shadow-lg"
          color="primary"
          mat-icon-button
          type="button"
          [ngClass]="day.actionDay.workState">
          <mat-icon svgIcon="mat:question_mark"></mat-icon>
        </button>
      }
    </div>
  `,
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: CustomDateFormats.MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' } // Pour s'assurer que la locale est en français
  ],
  animations: [scaleInOutAnimation],
  styles: [
    `
      .bg-grey {
        background-color: grey;
      }
      .day-square {
        position: relative; /* Nécessaire pour que les enfants en absolute soient positionnés par rapport à ce div */
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .day-state {
        position: absolute;
        top: 0;
        width: 50px;
        height: 10px;
        background-color: grey;
        border: thin solid;
      }
      .NORMAL {
        background-color: white;
      }
      .WEEK_END {
        background-color: grey;
      }
      .FERIE {
        background-color: black;
      }
      .work-state {
        position: absolute;
        top: 10px;
        width: 50px;
        height: 40px;
        border: thin solid;
      }

      .day-text {
        position: relative; /* Permet de le placer au-dessus des autres éléments */
        z-index: 1; /* Plus grand que .day-state et .work-state */
        color: black; /* Optionnel, ajustez selon votre design */

        margin: 0; /* Supprime les marges par défaut */
      }
      button {
        z-index: 2;
        border-radius: 50%;
      }
      p {
        font-size: 0.8rem;
        line-height: 5px;
      }
      h2 {
        font-size: 1.2rem; /* Ajuste la taille du texte */
        font-weight: bold;
      }
    `
  ],
  standalone: true,
  imports: [CommonModule, MatIconModule]
})
export class DaySquareDumb {
  @Input() day!: DayApp;
  @Input() isSelected: boolean = false;
  @Input() isLastSelected: boolean = false;
  @Output() clickLast = new EventEmitter<DayApp>();
  @Output() clickDay = new EventEmitter<void>();

  constructor() {
    registerLocaleData(localeFr);
  }

  clickLastOutput(day: DayApp): void {
    this.clickLast.emit(day);
  }
  clickDayOutput(day: DayApp): void {
    if (!day.actionDay && day.workState === WORK_STATE.TRAVAIL) {
      this.clickDay.emit();
    }
  }
}
