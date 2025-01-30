import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { eachDayOfInterval, eachMonthOfInterval, format } from 'date-fns';
import { DayApp } from 'src/app/models/day-app.model';
@Component({
  selector: 'dumb-day-state',
  template: `
    <div class="day-square">
      <div class="day-state" [ngClass]="day.dayState"></div>
      <div class="work-state" [ngClass]="day.workState"></div>
      <h2 class="">{{ day.date.getDate() }}</h2>
    </div>
  `,
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
      h2 {
        position: relative; /* Permet de le placer au-dessus des autres éléments */
        z-index: 1; /* Plus grand que .day-state et .work-state */
        color: black; /* Optionnel, ajustez selon votre design */
        font-size: 1.2rem; /* Ajuste la taille du texte */
        font-weight: bold;
        margin: 0; /* Supprime les marges par défaut */
      }
    `
  ],
  standalone: true,
  imports: [CommonModule]
})
export class DaySquareDumb {
  @Input() day!: DayApp;
}
