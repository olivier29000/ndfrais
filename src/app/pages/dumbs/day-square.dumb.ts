import { CommonModule, registerLocaleData } from '@angular/common';
import { Component, Injectable, Input } from '@angular/core';
import {
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatDateFormats
} from '@angular/material/core';
import { DayApp } from 'src/app/models/day-app.model';
import localeFr from '@angular/common/locales/fr';
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
    <div class="day-square  mt-1">
      <div class="day-state" [ngClass]="day.weekState"></div>
      <div class="work-state" [ngClass]="day.workState"></div>
      <div class="day-text text-center">
        <h2 class="">{{ day.date.getDate() }}</h2>
        <p>{{ day.date | date: 'EEE' : '' : 'fr' | slice: 0 : 2 }}</p>
      </div>
    </div>
  `,
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: CustomDateFormats.MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' } // Pour s'assurer que la locale est en français
  ],
  styles: [
    `
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
      .TRAVAIL {
        background-color: #a1fb8e;
      }
      .REPOS {
        background-color: white;
      }
      .CONGES {
        background-color: #067ef5;
      }
      .RTT {
        background-color: #051ef5;
      }
      .day-text {
        position: relative; /* Permet de le placer au-dessus des autres éléments */
        z-index: 1; /* Plus grand que .day-state et .work-state */
        color: black; /* Optionnel, ajustez selon votre design */

        margin: 0; /* Supprime les marges par défaut */
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
  imports: [CommonModule]
})
export class DaySquareDumb {
  @Input() day!: DayApp;

  constructor() {
    registerLocaleData(localeFr);
  }
}
