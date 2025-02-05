import { CommonModule, NgClass, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { eachDayOfInterval, eachMonthOfInterval, format } from 'date-fns';
import { DayApp, workStateItem } from 'src/app/models/day-app.model';
import { DaySquareDumb } from './day-square.dumb';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { scaleInOutAnimation } from '@vex/animations/scale-in-out.animation';
@Component({
  selector: 'dumb-work-state',
  template: `
    <div
      class="card p-6 relative hover:shadow-lg transition duration-200 ease-out-swift flex flex-col items-center">
      <div
        [ngClass]="iconClass"
        class="rounded-full w-12 h-12 flex items-center justify-center">
        <mat-icon [svgIcon]="workState.icon"></mat-icon>
      </div>

      <h3 class="subheading-2 font-medium text-secondary m-0">
        {{ workState.label }}
      </h3>

      <button
        *ngIf="helpText"
        [matTooltip]="helpText"
        class="absolute top-0 left-0 mt-2 ml-2 text-hint"
        mat-icon-button
        matTooltipPosition="after"
        type="button">
        <mat-icon class="icon-sm" svgIcon="mat:help"></mat-icon>
      </button>
    </div>
  `,
  styles: [``],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [scaleInOutAnimation],
  imports: [
    CommonModule,
    NgClass,
    MatIconModule,
    NgIf,
    MatButtonModule,
    MatTooltipModule,
    MatBottomSheetModule
  ]
})
export class WorkStateDumb {
  @Input({ required: true }) workState!: workStateItem;
  @Input() helpText?: string;
  @Input() iconClass?: string;
}
