import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'dumb-hour-calendar',
  template: `
    <div
      class="border-top border-end view-hour-segment"
      (mouseover)="segmentHoverChange(true)"
      (mouseleave)="segmentHoverChange(false)"
      (mousedown)="onMouseDown(segment.date)"
      (mouseup)="onMouseUp(segment.date)"
      (focus)="(hovered)">
      @if (isTimeLabel) {
        <span class="font-bold h-full w-full flex justify-center items-center">
          {{ segment.date | date: 'shortTime' : '' : locale }}
        </span>
      } @else {
        <div
          class="hour-element w-full flex justify-center items-center"
          [ngClass]="hovered ? 'hour-element-hovered' : ''">
          <span
            class="mx-auto text-center"
            [ngStyle]="{
              visibility: hovered ? 'visible' : 'hidden'
            }">
            {{ segment.date | date: 'shortTime' : '' : locale }}
          </span>
        </div>
      }
    </div>
  `,
  standalone: true,
  imports: [CommonModule],
  styles: [
    `
      .view-hour-segment {
        width: 100%;
        height: 100%;
      }
      .hour-element {
        width: 100%;
        height: 100%;
      }
      .hour-element-hovered {
        background-color: grey; /* Couleur de fond au survol */
        color: white; /* Optionnel : changer la couleur du texte aussi */
      }
    `
  ]
})
export class HourCalendarDumb {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() segment: any;
  @Input() locale!: string;
  @Input() isTimeLabel!: boolean;
  hovered = false;
  onMouseDown(date: Date) {
    console.log('Clic détecté !');
    console.log(date);
    // Action à exécuter au moment du clic
  }

  onMouseUp(date: Date) {
    console.log('Clic relâché !');
    console.log(date);
    // Action à exécuter au moment du relâchement
  }
  segmentHoverChange(value: boolean): void {
    this.hovered = value;
  }
}
