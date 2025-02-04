import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { DaySquareDumb } from './dumbs/day-square.dumb';
import { ServerService } from 'src/app/services/server.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { OrganigrammeDumb } from './dumbs/organigramme.dumb';
@Component({
  selector: 'vex-dashboard-analytics',
  template: `
    <dumb-organigramme></dumb-organigramme>
    <div class="row">
      <div class="col text-center">
        <mat-button-toggle-group class="mt-6">
          <mat-button-toggle value="left">
            <mat-icon svgIcon="mat:keyboard_arrow_left"></mat-icon
          ></mat-button-toggle>
          <mat-button-toggle value="center">2025</mat-button-toggle>
          <mat-button-toggle value="right">
            <mat-icon svgIcon="mat:keyboard_arrow_right"></mat-icon
          ></mat-button-toggle>
        </mat-button-toggle-group>
      </div>
    </div>
    <div class="row">
      <div class="col ">
        <mat-button-toggle-group
          name="ingredients"
          aria-label="Ingredients"
          [ngModel]="['lundi', 'mercredi', 'samedi']"
          multiple>
          <mat-button-toggle value="lundi"> lundi </mat-button-toggle>
          <mat-button-toggle value="mardi"> mardi </mat-button-toggle>
          <mat-button-toggle value="mercredi"> mercredi </mat-button-toggle>
          <mat-button-toggle value="jeudi"> jeudi </mat-button-toggle>
          <mat-button-toggle value="vendredi"> vendredi </mat-button-toggle>
          <mat-button-toggle value="samedi"> samedi </mat-button-toggle>
          <mat-button-toggle value="dimanche"> dimanche </mat-button-toggle>
        </mat-button-toggle-group>
      </div>
    </div>
  `,
  styles: [
    `
      .day-square {
        width: 50px;
        height: 50px;
      }
    `
  ],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatIconModule,
    FormsModule,
    OrganigrammeDumb
  ]
})
export class CongesPage {
  constructor(private server: ServerService) {}
  hideMultipleSelectionIndicator = signal(false);
}
