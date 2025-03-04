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
import { DayApp, WEEK_STATE, WORK_STATE } from 'src/app/models/day-app.model';
import localeFr from '@angular/common/locales/fr';
import { MatIconModule } from '@angular/material/icon';
import { scaleInOutAnimation } from '@vex/animations/scale-in-out.animation';
import { MatTooltipModule } from '@angular/material/tooltip';
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
    <div
      class="card day-square mt-3 mx-auto"
      [ngClass]="isBordered ? 'scaled' : ''"
      [matTooltip]="day.workState">
      <div class="day-state" [ngClass]="day.weekState"></div>
      @if (isUnderlined) {
        <div class="isUnderlined"></div>
      }
      <div
        class="work-state"
        [ngClass]="
          isSelected && day.workState === WORK_STATE.TRAVAIL
            ? 'half-bg-' + selectedWorkstate + ' ' + day.workState
            : day.workState
        "
        (click)="clickDayOutput(day)"></div>
      <div class="day-text text-center" (click)="clickDayOutput(day)">
        <h2 class="">{{ day.date.getDate() }}</h2>
        <p>{{ day.date | date: 'EEE' : '' : 'fr' | slice: 0 : 2 }}</p>
      </div>
      @if (isLastSelected) {
        <button
          @scaleInOut
          class="absolute -top-3 bg-foreground shadow-xl hover:shadow-lg"
          [ngClass]="selectedWorkstate"
          color="primary"
          mat-icon-button
          type="button"
          (click)="validPeriodOutput()">
          <mat-icon svgIcon="mat:check"></mat-icon>
        </button>
        <button
          @scaleInOut
          class="absolute -top-3 -right-3 bg-foreground shadow-xl hover:shadow-lg"
          [ngClass]="selectedWorkstate"
          color="primary"
          mat-icon-button
          type="button"
          (click)="clickLastOutput(day)">
          <mat-icon svgIcon="mat:highlight_off"></mat-icon>
        </button>
      } @else if (day.actionDay && !isSelected) {
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
      .scaled {
        transform: scale(1.2); /* Agrandit l'élément de 1.5x */
        z-index: 100;
      }

      .half-bg-TRAVAIL {
        background: linear-gradient(to bottom, #a1fb8e 50%, transparent 50%);
      }
      .half-bg-REPOS {
        background: linear-gradient(to bottom, white 50%, transparent 50%);
      }
      .half-bg-CONGE {
        background: linear-gradient(to bottom, #067ef5 50%, transparent 50%);
      }
      .half-bg-RTT {
        background: linear-gradient(to bottom, #051ef5 50%, transparent 50%);
      }
      .half-bg-ARRET_MALADIE {
        background: linear-gradient(to bottom, red 50%, transparent 50%);
      }
      .half-bg-CONGE_SANS_SOLDE {
        background: linear-gradient(to bottom, purple 50%, transparent 50%);
      }
      .half-bg-TELETRAVAIL {
        background: linear-gradient(to bottom, pink 50%, transparent 50%);
      }
      .half-bg-RECUP {
        background: linear-gradient(to bottom, orange 50%, transparent 50%);
      }
      .bg-grey {
        background: grey;
      }
      .day-square {
        position: relative; /* Nécessaire pour que les enfants en absolute soient positionnés par rapport à ce div */
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .day-state {
        position: absolute;
        top: 0;
        width: 40px;
        height: 10px;
        background-color: grey;
        border: thin solid;
      }

      @keyframes clignotement {
        0% {
          opacity: 1;
        }
        50% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }

      .isUnderlined {
        animation: clignotement 2s infinite;
      }

      .isUnderlined {
        position: absolute;
        top: -5px;
        width: 40px;
        height: 5px;
        background-color: #111827;
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
        width: 40px;
        height: 40px;
        border: thin solid;
      }

      .day-text {
        position: relative; /* Permet de le placer au-dessus des autres éléments */
        z-index: 1; /* Plus grand que .day-state et .work-state */
        color: black; /* Optionnel, ajustez selon votre design */

        margin: 0; /* Supprime les marges par défaut */
        margin-top: 5px; /* Supprime les marges par défaut */
      }
      button {
        z-index: 2;
        border-radius: 50%;
      }
      p {
        font-size: 0.7rem;
        line-height: 5px;
      }
      h2 {
        font-size: 1.1rem; /* Ajuste la taille du texte */
        font-weight: bold;
      }
    `
  ],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule]
})
export class DaySquareDumb {
  WEEK_STATE = WEEK_STATE;
  WORK_STATE = WORK_STATE;
  @Input() day!: DayApp;
  @Input() selectedWorkstate!: string;
  @Input() isSelected: boolean = false;
  @Input() isLastSelected: boolean = false;
  @Input() isBordered: boolean = false;
  @Input() isUnderlined: boolean = false;

  @Output() clickLast = new EventEmitter<DayApp>();
  @Output() validPeriod = new EventEmitter<void>();
  @Output() clickDay = new EventEmitter<void>();

  constructor() {
    registerLocaleData(localeFr);
  }

  clickLastOutput(day: DayApp): void {
    this.clickLast.emit(day);
  }
  validPeriodOutput(): void {
    this.validPeriod.emit();
  }
  clickDayOutput(day: DayApp): void {
    if (!day.actionDay && day.workState === WORK_STATE.TRAVAIL) {
      this.clickDay.emit();
    }
  }
}
